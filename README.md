# RUDRA OS (Responsive Unified Decision & Resource Assistant)

RUDRA OS is a production-ready, **multi-agent AI operating system** designed to manage a user’s life through intelligent coordination of tasks, schedules, and contextual information.

Built for the Google Gen AI Hackathon, it demonstrates complex cross-agent communication and autonomous planning.

---

## 🏗 Architecture Detail

RUDRA OS follows a **Hub-and-Spoke Orchestration** pattern:

1.  **RUDRA Core (Orchestrator)**: Uses LLM reasoning to decompose intent into subtasks.
2.  **Specialized Agents**:
    -   **TaskAgent**: Manages priorities and deadlines.
    -   **CalendarAgent**: Handles scheduling and conflict resolution.
    -   **KnowledgeAgent**: Manages notes and semantic memory.
    -   **ContextAgent**: Analyzes behavioral patterns and "Life Modes."
    -   **ExecutionAgent**: Interfaces with external tools.

### Communication Flow
User Query → Orchestrator → (N) Sub-Agents → Orchestrator → Unified Response

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional but recommended)
- **Google API Key** for Gemini 1.5 Flash

### Setup

1. **Clone & Install Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Setup Database**
   ```bash
   cd backend
   npx prisma generate
   # Ensure DATABASE_URL is set in .env
   npx prisma db push
   ```

3. **Install Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://user:pass@localhost:5432/rudra
   ```

---

## 💡 Multi-Step Workflows

### Scenario 1: Weekly Planning
Target: "Plan my next week for maximum productivity"
- **RUDRA Core** analyzes the existing calendar.
- **TaskAgent** identifies high-priority pending items.
- **CalendarAgent** allocates slots and buffer times.

### Scenario 2: High-Stakes Deadlines
Target: "I have an exam in 3 days, prepare a plan"
- **ContextAgent** switches system to "STUDY MODE."
- **TaskAgent** breaks study topics into manageable blocks.
- **CalendarAgent** clears less important meetings.

---

## 🎨 Premium Features
- **Life Modes**: FOCUS, STUDY, and CHILL modes dynamically change system behavior and UI aesthetics.
- **Explainability Layer**: Real-time visualization of agent thinking process (CoT).
- **Glassmorphism UI**: High-end Next.js dashboard with smooth Framer Motion transitions.

---

## 🏆 Hackathon Submission Goals
- **Multi-Agent Coordination**: Demonstrates true task delegation.
- **Real-World Utility**: Goes beyond a chatbot to an actual system of record.
- **Engineering Excellence**: Scalable FastAPI backend with Prisma integration.
