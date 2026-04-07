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

load_dotenv()

app = FastAPI(title="RUDRA OS", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
orchestrator = Orchestrator()
task_agent = TaskAgent()
calendar_agent = CalendarAgent()
knowledge_agent = KnowledgeAgent()
context_agent = ContextAgent()
execution_agent = ExecutionAgent()

class UserQuery(BaseModel):
    text: str
    user_id: str
    context: Optional[Dict[str, Any]] = {}

@app.get("/health")
async def health_check():
    return {"status": "online", "system": "RUDRA OS"}

@app.post("/query")
async def handle_query(query: UserQuery):
    # 1. Orchestrator determines the plan
    print(f"RUDRA Core received: {query.text}")
    plan_result = await orchestrator.determine_plan(query.text, query.context)
    
    # 2. Execute tasks according to plan (Simulated parallel execution)
    agent_results = []
    tasks = plan_result.get("plan", [])
    
    for task_info in tasks:
        agent_name = task_info.get("agent")
        task_desc = task_info.get("task")
        
        if "Task" in agent_name:
            res = await task_agent.execute_task(task_desc, query.context)
            agent_results.append({"agent": "TaskAgent", "result": res})
        elif "Calendar" in agent_name:
            res = await calendar_agent.execute_task(task_desc, query.context)
            agent_results.append({"agent": "CalendarAgent", "result": res})
        elif "Knowledge" in agent_name:
            res = await knowledge_agent.execute_task(task_desc, query.context)
            agent_results.append({"agent": "KnowledgeAgent", "result": res})
            
    # 3. Context analysis
    context_res = await context_agent.analyze_context(query.text, query.context.get("mode", "CHILL"), query.context)
    
    # 4. Final Consolidation (Simplistically combining results for now)
    return {
        "thought": plan_result.get("thought", "Analyzing..."),
        "agent_responses": agent_results,
        "context_update": context_res,
        "final_response": f"RUDRA OS has successfully executed the plan for: {query.text}"
    }

# CRUD Endpoints for Dashboard (Simplified/Mocked for Demo)
@app.get("/tasks")
async def get_tasks():
    # This would normally query the database
    return [
        {"id": "1", "title": "Finish Hackathon Project", "priority": "CRITICAL", "status": "IN_PROGRESS"},
        {"id": "2", "title": "Buy groceries", "priority": "LOW", "status": "TODO"}
    ]

@app.get("/calendar")
async def get_calendar():
    return [
        {"id": "101", "title": "Team Standup", "startTime": "2026-04-08T09:00:00", "endTime": "2026-04-08T09:30:00"},
        {"id": "102", "title": "Deep Work Session", "startTime": "2026-04-08T10:00:00", "endTime": "2026-04-08T12:00:00"}
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
