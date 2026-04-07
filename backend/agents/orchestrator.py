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
        
        Current Context: {json.dumps(context, indent=2)}
        
        Identify the subtasks and delegate them to the following agents:
        - TaskAgent (to-dos, deadlines)
        - CalendarAgent (scheduling, conflicts)
        - KnowledgeAgent (notes, summaries)
        - ContextAgent (urgency, lifestyle analysis)
        
        Return a JSON object with:
        {{
            "thought": "Internal reasoning (Chain-of-Thought)",
            "plan": [
                {{
                    "agent": "Name of the Agent",
                    "task": "Specific task for that agent"
                }}
            ],
            "estimated_impact": "Summary of what will change"
        }}
        """
        response = self.model.generate_content(prompt)
        # Attempt to parse JSON from response
        try:
            # Simple parsing for demo (should be more robust in real production code)
            plan_json = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(plan_json)
        except Exception as e:
            return {
                "thought": f"Error parsing orchestrator response: {str(e)}",
                "plan": [],
                "estimated_impact": "Unknown"
            }
