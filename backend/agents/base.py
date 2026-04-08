import json
import os
import google.generativeai as genai
from typing import Dict, Any, Optional, List
from datetime import datetime, date
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
    
    def _json_serial(self, obj):
        """JSON serializer for objects not serializable by default json code"""
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        raise TypeError ("Type %s not serializable" % type(obj))

    def to_json(self, data: Any) -> str:
        """Unified JSON serialization with datetime support."""
        return json.dumps(data, indent=2, default=self._json_serial)

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the primary task for the agent."""
        raise NotImplementedError("Each specialized agent must implement execute_task.")
