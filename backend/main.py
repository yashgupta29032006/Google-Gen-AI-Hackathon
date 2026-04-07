from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import json
import asyncio
import os
from dotenv import load_dotenv

# Import our agents
from agents.orchestrator import Orchestrator
from agents.task_agent import TaskAgent
from agents.calendar_agent import CalendarAgent
from agents.knowledge_agent import KnowledgeAgent
from agents.context_agent import ContextAgent
from agents.execution_agent import ExecutionAgent

# Import Prisma
from prisma import Prisma

load_dotenv()

app = FastAPI(title="RUDRA OS", version="1.0.0")
db = Prisma()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
agents = {
    "Orchestrator": Orchestrator(),
    "TaskAgent": TaskAgent(),
    "CalendarAgent": CalendarAgent(),
    "KnowledgeAgent": KnowledgeAgent(),
    "ContextAgent": ContextAgent(),
    "ExecutionAgent": ExecutionAgent()
}

class UserQuery(BaseModel):
    text: str
    user_id: str
    context: Optional[Dict[str, Any]] = {}

class TaskUpdate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "MEDIUM"
    userId: str

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

@app.get("/health")
async def health_check():
    return {"status": "online", "system": "RUDRA OS"}

from datetime import datetime
import re

def normalize_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    """Helper to convert various ISO-8601 strings from LLM to valid Python datetime objects."""
    if not dt_str:
        return None
    try:
        # Standardize format (remove 'Z' and ensure 'T' is present)
        clean_str = dt_str.replace('Z', '').replace(' ', 'T')
        # If it's just a date, add a time
        if 'T' not in clean_str:
            clean_str += "T00:00:00"
        return datetime.fromisoformat(clean_str)
    except Exception:
        return None

@app.post("/query")
async def handle_query(query: UserQuery):
    try:
        # 0. Ensure user exists (Fix for foreign key constraint)
        user = await db.user.find_unique(where={"id": query.user_id})
        if not user:
            await db.user.create(data={
                "id": query.user_id,
                "email": f"{query.user_id}@rudra.ai",
                "name": query.user_id.capitalize()
            })

        # 0.5. Prepare full context from DB (for better agent reasoning)
        db_tasks = await db.task.find_many(where={"userId": query.user_id})
        db_events = await db.event.find_many(where={"userId": query.user_id})
        
        full_context = {
            **query.context,
            "tasks": [t.dict() for t in db_tasks],
            "schedule": [e.dict() for e in db_events]
        }

        # 1. Orchestrator determines the plan
        plan_result = await agents["Orchestrator"].determine_plan(query.text, full_context)
        tasks_to_execute = plan_result.get("plan", [])
        
        # 2. Parallel Agent Execution
        executed_tasks = []
        agent_names_used = []
        
        async def run_agent_task(task_info):
            agent_name = task_info.get("agent")
            task_desc = task_info.get("task")
            agent_key = next((k for k in agents.keys() if k.lower() in agent_name.lower()), None)
            
            if agent_key and agent_key != "Orchestrator":
                try:
                    res = await agents[agent_key].execute_task(task_desc, full_context)
                    agent_names_used.append(agent_key)
                    return {"agent": agent_key, "result": res}
                except Exception as e:
                    return {"agent": agent_key, "error": str(e)}
            return None

        # Execute in parallel
        results = await asyncio.gather(*(run_agent_task(t) for t in tasks_to_execute))
        results = [r for r in results if r is not None]
        
        # 3. Process database updates from results (with granular error handling)
        reasoning_steps = [f"Orchestrator: {plan_result.get('thought', '')}"]
        final_responses = []

        for r in results:
            agent = r["agent"]
            res = r.get("result", {})
            
            if "error" in r:
                reasoning_steps.append(f"{agent}: FAILED with error {r['error']}")
                continue

            reasoning_steps.append(f"{agent}: {res.get('thought', 'Executed task.')}")
            if "final_response" in res:
                final_responses.append(res["final_response"])
            
            try:
                # Persist TaskAgent changes
                if agent == "TaskAgent" and res.get("action") in ["ADD", "UPDATE", "DELETE"]:
                    for t in res.get("modified_tasks", []):
                        if res["action"] == "ADD":
                            await db.task.create(data={
                                "title": t["title"],
                                "priority": t.get("priority", "MEDIUM"),
                                "status": t.get("status", "TODO"),
                                "deadline": normalize_datetime(t.get("deadline")),
                                "userId": query.user_id
                            })
                        elif res["action"] == "UPDATE" and t.get("id"):
                            await db.task.update(where={"id": t["id"]}, data={
                                "title": t.get("title"),
                                "priority": t.get("priority"),
                                "status": t.get("status"),
                                "deadline": normalize_datetime(t.get("deadline"))
                            })
                        elif res["action"] == "DELETE" and t.get("id"):
                            await db.task.delete(where={"id": t["id"]})

                # Persist CalendarAgent changes
                if agent == "CalendarAgent" and res.get("action") in ["SCHEDULE", "RESCHEDULE", "CANCEL"]:
                    for e in res.get("updated_schedule", []):
                        start_time = normalize_datetime(e.get("startTime"))
                        end_time = normalize_datetime(e.get("endTime"))
                        
                        if not start_time or not end_time:
                            reasoning_steps.append(f"{agent}: Skipped event due to invalid dates.")
                            continue

                        if res["action"] == "SCHEDULE":
                            await db.event.create(data={
                                "title": e["title"],
                                "startTime": start_time,
                                "endTime": end_time,
                                "location": e.get("location", ""),
                                "userId": query.user_id
                            })
                        elif res["action"] == "RESCHEDULE" and e.get("id"):
                            await db.event.update(where={"id": e["id"]}, data={
                                "startTime": start_time,
                                "endTime": end_time
                            })
                        elif res["action"] == "CANCEL" and e.get("id"):
                            await db.event.delete(where={"id": e["id"]})
            except Exception as inner_e:
                reasoning_steps.append(f"{agent}: Database Persistence failed - {str(inner_e)}")

        # 4. Format Structured Response
        main_response = " ".join(final_responses) if final_responses else f"RUDRA OS has successfully executed the plan for: {query.text}"
        
        return {
            "response": main_response,
            "agents_used": list(set(agent_names_used)),
            "reasoning": "\n".join(reasoning_steps)
        }

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return {
            "response": "I encountered a system-wide error while processing your request. Please try again.",
            "agents_used": ["Orchestrator"],
            "reasoning": f"System Crash: {str(e)}"
        }

@app.get("/tasks")
async def get_tasks(user_id: str = "demo-user"):
    tasks = await db.task.find_many(where={"userId": user_id})
    return tasks

@app.post("/tasks")
async def create_task(task_data: TaskUpdate):
    try:
        # Pre-check if user exists for this demo (simplified)
        user = await db.user.find_unique(where={"id": task_data.userId})
        if not user:
            await db.user.create(data={"id": task_data.userId, "email": f"{task_data.userId}@example.com"})
            
        task = await db.task.create(data={
            "title": task_data.title,
            "description": task_data.description,
            "priority": task_data.priority,
            "userId": task_data.userId
        })
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/calendar")
async def get_calendar(user_id: str = "demo-user"):
    events = await db.event.find_many(where={"userId": user_id})
    return events

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
