'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Zap, 
  Settings, 
  User,
  Coffee,
  Book,
  Target
} from 'lucide-react'
import Dashboard from '../components/Dashboard'
import Chat from '../components/Chat'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard')
  const [lifeMode, setLifeMode] = useState<'CHILL' | 'STUDY' | 'FOCUS'>('CHILL')
  
  // Life Mode Colors
  const modeColors = {
    CHILL: 'from-blue-500 to-cyan-400',
    STUDY: 'from-purple-500 to-indigo-400',
    FOCUS: 'from-orange-500 to-red-400'
  }

  return (
    <main className="container animate-fade-in">
      {/* Header */}
      <header className="glass modern-card flex justify-between items-center mb-8 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 shadow-lg">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RUDRA OS</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">unified life assistant</p>
          </div>
        </div>

        {/* Life Mode Toggles */}
        <div className="flex bg-black/20 p-1 rounded-xl gap-1">
          <button 
            onClick={() => setLifeMode('CHILL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${lifeMode === 'CHILL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Coffee size={16} /> Chill
          </button>
          <button 
            onClick={() => setLifeMode('STUDY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${lifeMode === 'STUDY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Book size={16} /> Study
          </button>
          <button 
            onClick={() => setLifeMode('FOCUS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${lifeMode === 'FOCUS' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Target size={16} /> Focus
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
            <User size={20} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex gap-8 mb-8">
        <nav className="flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-4 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg' : 'glass text-slate-400 hover:text-white'}`}
          >
            <Calendar size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-4 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'chat' ? 'bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg' : 'glass text-slate-400 hover:text-white'}`}
          >
            <MessageSquare size={24} />
          </button>
          <button className="glass p-4 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white opacity-50 cursor-not-allowed">
            <CheckCircle size={24} />
          </button>
        </nav>

        <div className="flex-1 min-h-[600px] relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard lifeMode={lifeMode} />
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Chat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 opacity-30 text-xs tracking-widest font-mono uppercase">
        RUDRA OS v1.0.0 &copy; 2026 Integrated Multi-Agent System
      </footer>
    </main>
  )
}
