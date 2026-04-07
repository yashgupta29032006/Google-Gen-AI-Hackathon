from typing import List, Dict, Any, Optional
from .base import BaseAgent
import asyncio
import json

class ContextAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RUDRA Context Analyzer",
            role="Specialist in analyzing time, urgency, and user behavior patterns."
        )

    async def analyze_context(self, query: str, current_mode: str, data: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        User Query: {query}
        Current Mode: {current_mode}
        
        Recent Activity: {json.dumps(data.get('logs', []), indent=2)}
        
        Determine if there is an urgency shift or if we should suggest changing "Life Modes".
        Return JSON with:
        {{
            "thought": "Internal reasoning (Chain-of-Thought)",
            "suggested_mode": "FOCUS | STUDY | CHILL | NO_CHANGE",
            "urgency_level": "Level 1 to 5",
            "observation": "What the user behavior patterns suggest"
        }}
        """
        response = self.model.generate_content(prompt)
        try:
            res_json = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(res_json)
        except Exception as e:
            return {
                "thought": f"Error parsing context agent response: {str(e)}",
                "suggested_mode": "NO_CHANGE",
                "urgency_level": "Unknown"
            }
