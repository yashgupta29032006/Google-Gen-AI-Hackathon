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

    async def analyze_context(self, query: str, current_mode: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyzes behavior, urgency, and suggests 'Life Mode' adjustments."""
        full_prompt = f"""
        User Interaction: {query}
        Current Life Mode: {current_mode}
        Recent History: {json.dumps(history, indent=2)}
        
        Analyze the emotional tone, urgency, and behavioral context.
        Return JSON with:
        {{
            "thought": "Internal reasoning (CoT)",
            "sentiment": "POSITIVE | NEUTRAL | NEGATIVE | STRESSED",
            "urgency": "CRITICAL | HIGH | MEDIUM | LOW",
            "suggested_mode": "CHILL | FOCUS | STUDY",
            "reasoning": "Why this mode is suggested"
        }}
        """
        response = self.model.generate_content(full_prompt)
        return self._parse_json(response.text)

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # ContextAgent primarily uses analyze_context, but we implement execute_task for consistency
        return await self.analyze_context(prompt, context.get('mode', 'CHILL'), context.get('history', []))
