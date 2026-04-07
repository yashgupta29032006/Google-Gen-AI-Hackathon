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
        full_prompt = f"""
        Task description: {prompt}
        
        Current Tasks: {json.dumps(context.get('tasks', []), indent=2)}
        
        Provide your internal reasoning and the modified task list.
        Return JSON with:
        {{
            "thought": "Internal reasoning (Chain-of-Thought)",
            "action": "ADD | UPDATE | DELETE | ANALYZE",
            "modified_tasks": [{{ "title": "...", "priority": "...", "status": "...", "deadline": "..." }}],
            "final_response": "Explanation to the user"
        }}
        """
        response = self.model.generate_content(full_prompt)
        try:
            res_json = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(res_json)
        except Exception as e:
            return {
                "thought": f"Error parsing task agent response: {str(e)}",
                "modified_tasks": [],
                "final_response": "RUDRA Task Agent encountered an error."
            }
