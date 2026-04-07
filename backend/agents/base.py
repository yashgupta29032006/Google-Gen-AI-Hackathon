import json
import os
import google.generativeai as genai
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            pass
        
        genai.configure(api_key=api_key)
        # Using the confirmed available gemini-flash-latest model ID
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def _parse_json(self, text: str) -> Dict[str, Any]:
        """Robustly parse JSON from LLM response, stripping markdown blocks if needed."""
        try:
            # Try parsing the text directly
            return json.loads(text.strip())
        except json.JSONDecodeError:
            # Fallback: Look for ```json ... ``` or just ``` ... ``` blocks
            try:
                import re
                match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
                if match:
                    return json.loads(match.group(1).strip())
            except Exception:
                pass
            
            # Last resort: Try common string manipulations to find JSON-like structure
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                try:
                    return json.loads(text[start:end+1])
                except:
                    pass
        
        return {"error": "Failed to parse JSON response", "raw_text": text}

    async def generate_thought(self, prompt: str, context: Dict[str, Any]) -> str:
        """Standardize internal reasoning generation."""
        full_prompt = f"""
        System Role: {self.role}
        Agent Name: {self.name}
        
        Context: {json.dumps(context, indent=2)}
        
        Task: {prompt}
        
        Provide your internal reasoning (Chain-of-Thought) for the next step. 
        Be concise but thorough.
        """
        response = self.model.generate_content(full_prompt)
        return response.text.strip()

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the primary task for the agent."""
        raise NotImplementedError("Each specialized agent must implement execute_task.")
