'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Task {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  deadline?: string;
}

interface TaskPanelProps {
  tasks: Task[];
}

const priorityConfig = {
  CRITICAL: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  HIGH: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  MEDIUM: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  LOW: { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' },
};

export default function TaskPanel({ tasks }: TaskPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 soul-gradient rounded-full" />
          <h3 className="font-headline text-lg font-bold tracking-tight">Active Tasks</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">
            {tasks.length}
          </span>
        </div>
        <button className="p-2 rounded-xl transition-all duration-300 hover:bg-white/5 text-white/40 hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => {
          const config = priorityConfig[task.priority];
          return (
            <div 
              key={task.id} 
              className="group relative glass-card bg-surface-high/30 p-5 rounded-[2rem] hover:bg-surface-high/50 hover:-translate-y-1 transition-all duration-300 ring-1 ring-white/5 hover:ring-white/10"
            >
              <div className="flex items-start gap-4">
                <button className="mt-1 transition-all duration-300 group-hover:scale-110">
                  {task.status === 'DONE' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/20 group-hover:text-primary/60 transition-colors" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md",
                      config.color,
                      config.bg
                    )}>
                      {task.priority}
                    </span>
                    {task.deadline && (
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/30">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className={cn(
                    "font-medium transition-all duration-300",
                    task.status === 'DONE' ? "text-white/30 line-through" : "text-white group-hover:text-primary"
                  )}>
                    {task.title}
                  </h4>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-5 h-5 text-white/20" />
                </div>
              </div>

              {/* Action Progress Bar for IN_PROGRESS */}
              {task.status === 'IN_PROGRESS' && (
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 soul-gradient rounded-full animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-20">
            <AlertCircle className="w-12 h-12" />
            <p className="font-medium tracking-tight">No active tasks found in memory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
