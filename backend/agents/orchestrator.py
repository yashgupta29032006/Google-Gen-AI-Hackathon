from typing import List, Dict, Any, Optional
from .base import BaseAgent
import asyncio
import json

class Orchestrator(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RUDRA Core",
            role="Primary Orchestrator for all user life management tasks."
        )

    async def determine_plan(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Single LLM Call: Decomposes query into structured actions for all agents.
        Only this agent calls the LLM.
        """
        prompt = f"""
        User Query: {query}
        
        Current System Context: {self.to_json(context)}
        
        You are the central brain of RUDRA OS. Your goal is to process the user query and return a COMPLETE execution plan.
        Available Agents & their required JSON data structures:
        
        1. TaskAgent (ADD|UPDATE|DELETE|ANALYZE):
           - "action": "ADD", "modified_tasks": [{{"title": "...", "priority": "HIGH|MEDIUM|LOW", "status": "TODO", "deadline": "ISO"}}]
           - "action": "UPDATE", "modified_tasks": [{{"id": "...", "title": "...", "priority": "...", "status": "..."}}]
           - "action": "DELETE", "modified_tasks": [{{"id": "..."}}]
        
        2. CalendarAgent (SCHEDULE|RESCHEDULE|CANCEL|ANALYZE):
           - "action": "SCHEDULE", "updated_schedule": [{{"title": "...", "startTime": "ISO", "endTime": "ISO", "location": "..."}}]
           - "action": "RESCHEDULE", "updated_schedule": [{{"id": "...", "startTime": "...", "endTime": "..."}}]
           - "action": "CANCEL", "updated_schedule": [{{"id": "..."}}]
        
        3. ContextAgent (ANALYZE):
           - "sentiment": "POSITIVE|NEUTRAL|NEGATIVE|STRESSED", "urgency": "CRITICAL|HIGH|MEDIUM|LOW", "suggested_mode": "CHILL|FOCUS|STUDY"
        
        4. KnowledgeAgent (ANALYZE|SEARCH):
           - "answer": "The direct answer from internal notes", "action_taken": "SEARCH"

        CRITICAL: Return a JSON object exactly as follows:
        {{
            "thought": "Internal reasoning (CoT) on why this plan was chosen.",
            "final_response": "What to tell the user directly.",
            "actions": [
                {{
                    "agent": "TaskAgent | CalendarAgent | ContextAgent | KnowledgeAgent | ExecutionAgent",
                    "data": {{ ... agent specific data from schemas above ... }}
                }}
            ],
            "agents_used": ["List", "of", "agent", "names"]
        """
        # 500ms delay before API call to prevent burst requests
        await asyncio.sleep(0.5)
        print("🔥 Gemini API called")
        response = self.model.generate_content(prompt)
        plan_data = self._parse_json(response.text)
        
        # Fallbacks
        if "actions" not in plan_data:
            plan_data["actions"] = []
        if "thought" not in plan_data:
            plan_data["thought"] = "RUDRA Orchestrator is planning the next steps..."
        if "final_response" not in plan_data:
            plan_data["final_response"] = "I've processed your request. How else can I help?"
            
        return plan_data
