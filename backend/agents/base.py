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
            # For hackathon/demo purposes, we'll try to get it from environment
            # or use a mock if not found in production deployment
            pass
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_thought(self, prompt: str, context: Dict[str, Any]) -> str:
        full_prompt = f"""
        System Role: {self.role}
        Agent Name: {self.name}
        
        Context: {json.dumps(context, indent=2)}
        
        Task: {prompt}
        
        Provide your internal reasoning (Chain-of-Thought) for the next step.
        """
        response = self.model.generate_content(full_prompt)
        return response.text

    async def execute_task(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # To be implemented by specialized agents
        raise NotImplementedError
