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
        prompt = f"""
        User Query: {query}
        
        Current System Context: {json.dumps(context, indent=2)}
        
        Decompose the user's intent into discrete tasks for specialized agents. 
        Available Agents:
        - TaskAgent: For creating, updating, or analyzing tasks/to-dos.
        - CalendarAgent: For scheduling events, checking availability, or resolving conflicts.
        - KnowledgeAgent: For retrieving information from notes or general knowledge queries.
        - ContextAgent: For analyzing the "Life Mode" (CHILL, FOCUS, STUDY) and overall context.
        - ExecutionAgent: For any actions requiring external tool integration (simulated).

        Return a JSON object exactly as follows:
        {{
            "thought": "Internal reasoning (CoT) on why this plan was chosen.",
            "plan": [
                {{
                    "agent": "Name of the Agent",
                    "task": "Specific, actionable task for the agent",
                    "priority": "HIGH | MEDIUM | LOW"
                }}
            ],
            "estimated_impact": "Summary of what will change in the system."
        }}
        """
        response = self.model.generate_content(prompt)
        plan_data = self._parse_json(response.text)
        
        # Ensure 'plan' is always a list even in failure scenarios
        if "plan" not in plan_data:
            plan_data["plan"] = []
        if "thought" not in plan_data:
            plan_data["thought"] = "RUDRA Orchestrator is planning the next steps..."
            
        return plan_data
