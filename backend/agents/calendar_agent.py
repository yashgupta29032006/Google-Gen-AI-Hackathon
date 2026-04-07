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
        """Manages schedule, conflicts, and events."""
        full_prompt = f"""
        Scheduling required for: {prompt}
        
        Current Schedule: {json.dumps(context.get('schedule', []), indent=2)}
        
        Analyze the request and provide schedule updates.
        Return JSON with:
        {{
            "thought": "Internal reasoning (CoT)",
            "action": "SCHEDULE | RESCHEDULE | CANCEL | ANALYZE",
            "updated_schedule": [
                {{ 
                    "id": "(use existing if reschedule/cancel)",
                    "title": "...", 
                    "startTime": "ISO format dateTime", 
                    "endTime": "ISO format dateTime", 
                    "location": "..." 
                }}
            ],
            "final_response": "What should the user be told?"
        }}
        """
        response = self.model.generate_content(full_prompt)
        res_data = self._parse_json(response.text)
        
        if "final_response" not in res_data:
            res_data["final_response"] = f"RUDRA Schedule Strategist has processed: {prompt}"
            
        return res_data
        
