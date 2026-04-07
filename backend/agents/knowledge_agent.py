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
        """Retrieves and manages information from notes and external knowledge."""
        full_prompt = f"""
        Information request: {prompt}
        
        System Notes: {json.dumps(context.get('notes', []), indent=2)}
        
        Analyze the request and provide relevant information or note updates.
        Return JSON with:
        {{
            "thought": "Internal reasoning (CoT)",
            "answer": "Direct answer to the user's question",
            "relevant_notes": [{{ "id": "...", "content": "..." }}],
            "action_taken": "SEARCH | CREATE_NOTE | ANALYZE",
            "final_response": "What should the user be told?"
        }}
        """
        response = self.model.generate_content(full_prompt)
        res_data = self._parse_json(response.text)
        
        if "final_response" not in res_data:
            res_data["final_response"] = res_data.get("answer", f"RUDRA Knowledge Agent has processed: {prompt}")
            
        return res_data
