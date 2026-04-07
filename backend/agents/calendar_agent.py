from typing import List, Dict, Any, Optional
from .base import BaseAgent
import asyncio
import json

class CalendarAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RUDRA Schedule Strategist",
            role="Specialist in managing life calendar, scheduling, and conflict resolution."
        )

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        full_prompt = f"""
        Task description: {prompt}
        
        Current Schedule: {json.dumps(context.get('schedule', []), indent=2)}
        
        Provide your internal reasoning and the updated schedule.
        Return JSON with:
        {{
            "thought": "Internal reasoning (Chain-of-Thought)",
            "action": "SCHEDULE | RESCHEDULE | CANCEL | ANALYZE",
            "updated_schedule": [{{ "title": "...", "startTime": "...", "endTime": "...", "location": "..." }}],
            "final_response": "Explanation to the user"
        }}
        """
        response = self.model.generate_content(full_prompt)
        try:
            res_json = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(res_json)
        except Exception as e:
            return {
                "thought": f"Error parsing calendar agent response: {str(e)}",
                "updated_schedule": [],
                "final_response": "RUDRA Calendar Agent encountered an error."
            }
        
