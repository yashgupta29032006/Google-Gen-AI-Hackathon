'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ExecutionTrace from '@/components/ExecutionTrace';
import Chat from '@/components/Chat';
import TaskPanel from '@/components/TaskPanel';
import Timeline from '@/components/Timeline';
import SuggestionCard from '@/components/SuggestionCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [trace, setTrace] = useState({ agents: [], reasoning: '', isProcessing: false });
  const [lastResponse, setLastResponse] = useState('');

  const fetchStaticData = async () => {
    try {
      const [tasksRes, calendarRes] = await Promise.all([
        fetch('http://localhost:8000/tasks?user_id=demo-user'),
        fetch('http://localhost:8000/calendar?user_id=demo-user')
      ]);
      const tasksData = await tasksRes.json();
      const calendarData = await calendarRes.json();
      setTasks(tasksData);
      setEvents(calendarData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleQuery = async (text: string) => {
    setTrace({ agents: [], reasoning: 'Orchestrating system resources...', isProcessing: true });
    try {
      const res = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          user_id: 'demo-user',
          context: { mode: 'CHILL' }
        })
      });
      const data = await res.json();
      
      setTrace({
        agents: data.agents_used || [],
        reasoning: data.reasoning || '',
        isProcessing: false
      });
      setLastResponse(data.response);
      
      // Refresh data after agent execution
      await fetchStaticData();
    } catch (err) {
      setTrace(t => ({ ...t, isProcessing: false, reasoning: 'System communication error.' }));
    }
  };

  useEffect(() => {
    fetchStaticData();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header / Stats Overlay */}
        <header className="p-12 pb-4 flex items-end justify-between z-10">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">System Overview</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-glow">Sentient Canvas</h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">Neural Pulse</p>
                <div className="flex items-center gap-2 justify-end">
                   <div className="flex gap-1 h-3 items-end">
                      {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                        <div key={i} className="w-1 bg-primary/40 rounded-full animate-pulse" style={{ height: `${h * 100}%` }} />
                      ))}
                   </div>
                   <span className="text-xs font-bold text-primary font-headline">94.2%</span>
                </div>
             </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto px-12 pt-8 pb-32 space-y-12">
          {/* Welcome / Response Card */}
          {lastResponse ? (
            <section className="glass-card bg-primary/5 border-primary/20 p-8 rounded-[3rem] animate-fade-in relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 scale-150">
                  <div className="w-12 h-12 soul-gradient blur-3xl rounded-full" />
               </div>
               <div className="space-y-4 max-w-2xl relative z-10">
                  <p className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase">Intelligence Output</p>
                  <p className="text-xl font-medium leading-relaxed tracking-tight text-white/90 antialiased">
                    {lastResponse}
                  </p>
               </div>
            </section>
          ) : (
            <section className="dashboard-grid h-48 pointer-events-none opacity-20">
               <div className="glass-card rounded-[3xl]" />
               <div className="glass-card rounded-[3xl]" />
            </section>
          )}

          {/* Core Modules Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <TaskPanel tasks={tasks} />
            <Timeline events={events} />
          </section>

          {/* Proactive Intelligence Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-tertiary rounded-full" />
              <h3 className="font-headline text-lg font-bold tracking-tight">Proactive Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SuggestionCard suggestion={{
                id: '1',
                type: 'EFFICIENCY',
                title: 'Schedule Optimization',
                description: 'Detected 2 gaps in your schedule. Would you like to fill them with deep work?',
                actionLabel: 'Optimize Plan'
              }} />
              <SuggestionCard suggestion={{
                id: '2',
                type: 'INSIGHT',
                title: 'Task Relationship',
                description: 'The task \"Buy milk\" is related to your \"Dinner with team\" event tomorrow.',
                actionLabel: 'View Context'
              }} />
              <SuggestionCard suggestion={{
                id: '3',
                type: 'ACTION',
                title: 'Agent Suggestion',
                description: 'ContextAgent detected low energy levels. Switching to CHILL mode for next 2 hours?',
                actionLabel: 'Activate Mode'
              }} />
            </div>
          </section>
        </div>

        {/* Floating Chat / Command Bar */}
        <div className="absolute bottom-12 left-0 right-0 z-30 px-12 pointer-events-none">
          <div className="pointer-events-auto">
             <Chat onQuery={handleQuery} isPending={trace.isProcessing} />
          </div>
        </div>
      </main>

      {/* 3. Right Trace Panel */}
      <ExecutionTrace 
        agents_used={trace.agents} 
        reasoning={trace.reasoning} 
        isProcessing={trace.isProcessing} 
      />
    </div>
  );
}
