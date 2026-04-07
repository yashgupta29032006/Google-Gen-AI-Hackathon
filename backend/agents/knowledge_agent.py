from typing import List, Dict, Any, Optional
from .base import BaseAgent
import asyncio
import json

class KnowledgeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RUDRA Librarian",
            role="Specialist in notes management, information retrieval, and summarization."
        )

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        full_prompt = f"""
        Task description: {prompt}
        
        Recent Notes: {json.dumps(context.get('notes', []), indent=2)}
        
        Provide your internal reasoning and retrieve information or create a summary.
        Return JSON with:
        {{
            "thought": "Internal reasoning (Chain-of-Thought)",
            "action": "STORE | RETRIEVE | SUMMARIZE",
            "content": "Resulting content or retrieved note",
            "final_response": "Explanation to the user"
        }}
        """
        response = self.model.generate_content(full_prompt)
        try:
            res_json = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(res_json)
        except Exception as e:
            return {
                "thought": f"Error parsing knowledge agent response: {str(e)}",
                "final_response": "RUDRA Knowledge Agent encountered an error."
            }
