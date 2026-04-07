'use client';

import React from 'react';
import { 
  Bot, 
  ChevronRight, 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ExecutionTraceProps {
  agents_used?: string[];
  reasoning?: string;
  isProcessing?: boolean;
}

const agentInfo: Record<string, { icon: any; color: string; bg: string }> = {
  Orchestrator: { icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/20' },
  TaskAgent: { icon: Cpu, color: 'text-secondary', bg: 'bg-secondary/20' },
  CalendarAgent: { icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  KnowledgeAgent: { icon: Globe, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  ContextAgent: { icon: MessageSquare, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/20' },
  ExecutionAgent: { icon: Database, color: 'text-rose-400', bg: 'bg-rose-400/20' },
};

export default function ExecutionTrace({ agents_used = [], reasoning = '', isProcessing }: ExecutionTraceProps) {
  const reasoningLines = reasoning.split('\n').filter(line => line.trim());

  return (
    <aside className="w-80 h-screen glass border-l-0 ring-1 ring-white/5 flex flex-col p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm animate-pulse">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-glow">Execution Engine</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {/* Active Agents Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 px-1">Active Agents</h3>
          {isProcessing && agents_used.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
              <Bot className="w-5 h-5 text-white/20 animate-bounce" />
              <p className="text-[10px] text-white/20 font-medium tracking-tight">Initializing Orchestrator...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {(agents_used.length > 0 ? agents_used : ['Orchestrator']).map((agent) => {
                const info = agentInfo[agent] || agentInfo.Orchestrator;
                return (
                  <div 
                    key={agent} 
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", info.bg)}>
                      <info.icon className={cn("w-4 h-4", info.color)} />
                    </div>
                    <span className="text-xs font-semibold tracking-tight text-white/80">{agent}</span>
                    <div className="ml-auto flex gap-1">
                      <div className={cn("w-1 h-1 rounded-full animate-pulse", info.color.replace('text', 'bg'))} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Thought Process Section */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Logs</h3>
          </div>
          
          <div className="space-y-4">
            {reasoningLines.map((line, idx) => {
              const [agentPart, ...thoughtParts] = line.split(': ');
              const thought = thoughtParts.join(': ');
              const info = agentInfo[agentPart] || agentInfo.Orchestrator;

              return (
                <div key={idx} className="relative pl-6 space-y-2 group">
                  {/* Vertical connect line */}
                  <div className="absolute left-[3px] top-4 bottom-[-24px] w-px bg-white/5 group-last:hidden" />
                  
                  {/* Step indicator */}
                  <div className={cn(
                    "absolute left-0 top-[6px] w-[7px] h-[7px] border-2 bg-background transition-colors duration-500",
                    isProcessing && idx === reasoningLines.length - 1 ? "border-primary animate-ping" : "border-white/10 group-hover:border-primary/40"
                  )} />
                  
                  <div className="flex flex-col gap-1.5 antialiased">
                    <span className={cn("text-[10px] font-bold tracking-widest uppercase", info.color)}>{agentPart}</span>
                    <p className="text-[11px] leading-relaxed text-white/60 font-medium lg:max-w-prose line-clamp-4 group-hover:line-clamp-none transition-all duration-500">{thought}</p>
                  </div>
                </div>
              );
            })}
            
            {isProcessing && (
              <div className="relative pl-6 flex items-center gap-2">
                <div className="w-[3px] h-[3px] bg-primary rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-primary animate-pulse tracking-widest uppercase">Processing Response...</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="glass-card bg-primary/10 border-primary/20 p-4 rounded-3xl group cursor-help transition-all duration-300 hover:bg-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="text-[11px] font-bold tracking-tight text-primary">Sentient Feedback</h4>
          </div>
          <p className="text-[10px] leading-relaxed text-primary/70 font-medium">System is operating at peak efficiency. Request duration optimized via parallel execution.</p>
        </div>
      </div>
    </aside>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
