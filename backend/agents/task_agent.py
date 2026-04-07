from typing import List, Dict, Any, Optional
from .base import BaseAgent
import asyncio
import json

class TaskAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RUDRA Task Expert",
            role="Specialist in managing tasks, priorities, and deadlines."
        )

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Manages tasks, priorities, and deadlines."""
        full_prompt = f"""
        Action required for: {prompt}
        
        Current Tasks: {json.dumps(context.get('tasks', []), indent=2)}
        
        Analyze the request and provide the necessary task modifications.
        Return JSON with:
        {{
            "thought": "Internal reasoning (CoT)",
            "action": "ADD | UPDATE | DELETE | ANALYZE",
            "modified_tasks": [
                {{ 
                    "id": "(use existing if update/delete)",
                    "title": "...", 
                    "priority": "HIGH | MEDIUM | LOW", 
                    "status": "TODO | IN_PROGRESS | DONE", 
                    "deadline": "ISO format date or null" 
                }}
            ],
            "final_response": "What should the user be told?"
        }}
        """
        response = self.model.generate_content(full_prompt)
        res_data = self._parse_json(response.text)
        
        if "final_response" not in res_data:
            res_data["final_response"] = f"RUDRA Task Agent has processed: {prompt}"
        
        return res_data
