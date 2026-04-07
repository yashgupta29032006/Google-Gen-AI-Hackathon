'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Welcome to RUDRA OS. How can I assist you with your life management today?', agents: [] }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    try {
      // Simulate API call to backend
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, user_id: 'demo-user', context: {} })
      })
      
      const data = await response.json()
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.final_response,
        thought: data.thought,
        agents: data.agent_responses || []
      }])
    } catch (error) {
      // Mock response for demo if backend not running
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed your request and coordinated with the Task and Calendar agents to optimize your schedule.",
          thought: "User intent: Weekly planning. Delegating to TaskAgent for priority identification and CalendarAgent for slot allocation.",
          agents: [
            { agent: 'TaskAgent', result: { thought: 'Prioritizing exams and high-impact projects.' } },
            { agent: 'CalendarAgent', result: { thought: 'Identifying free blocks and adding buffer times.' } }
          ]
        }])
      }, 2000)
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="glass modern-card h-full flex flex-col overflow-hidden max-h-[700px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">RUDRA Core</h3>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> system active
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'glass border-l-4 border-violet-500 rounded-tl-none'}`}>
                <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-widest font-bold opacity-60">
                   {m.role === 'user' ? <><User size={12} /> You</> : <><Bot size={12} /> RUDRA OS</>}
                </div>
                <p className="text-sm leading-relaxed">{m.content}</p>
                
                {m.thought && (
                   <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-slate-500 italic flex gap-2">
                       <span className="font-bold text-violet-400/60 not-italic">THOUGHT:</span> {m.thought}
                   </div>
                )}
              </div>

              {/* Agent Breakdown */}
              {m.agents && m.agents.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 pl-4">
                  {m.agents.map((agent: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="text-[10px] glass px-3 py-1.5 rounded-full font-bold flex items-center gap-2 border border-violet-500/30 text-violet-400"
                    >
                      <ArrowRight size={10} /> {agent.agent} Processed
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <div className="flex items-center gap-3 text-slate-500 italic text-sm animate-pulse">
            <Loader2 className="animate-spin text-violet-500" size={16} /> RUDRA is coordinating agents...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/5">
        <div className="glass flex items-center gap-2 p-2 px-4 rounded-2xl focus-within:ring-2 ring-violet-500/50 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Plan my week / I have an exam..." 
            className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-2 bg-violet-600 rounded-xl text-white hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
