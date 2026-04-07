'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Lightbulb, 
  Zap,
  Target
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Suggestion {
  id: string;
  type: 'EFFICIENCY' | 'INSIGHT' | 'ACTION';
  title: string;
  description: string;
  actionLabel: string;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick?: () => void;
}

const typeConfig = {
  EFFICIENCY: { icon: Zap, color: 'text-primary', bg: 'bg-primary/20', label: 'Optimization' },
  INSIGHT: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-400/20', label: 'Intelligence' },
  ACTION: { icon: Target, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/20', label: 'Proactive' },
};

export default function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  const config = typeConfig[suggestion.type];

  return (
    <div 
      onClick={onClick}
      className="group relative glass-card p-6 rounded-[3rem] bg-surface-lowest/40 hover:bg-surface-lowest/60 ring-1 ring-white/5 hover:ring-primary/20 cursor-pointer overflow-hidden transition-all duration-500"
    >
      {/* Dynamic background glow */}
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 blur-[64px] opacity-0 group-hover:opacity-10 transition-opacity duration-700",
        config.bg.replace('bg', 'bg-')
      )} />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg", config.bg)}>
              <config.icon className={cn("w-5 h-5", config.color)} />
            </div>
            <span className={cn("text-[10px] font-bold tracking-[0.2em] uppercase", config.color)}>{config.label}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-45">
            <ArrowUpRight className="w-4 h-4 text-white/40" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-headline text-lg font-bold tracking-tight text-glow group-hover:text-primary transition-colors duration-300">
            {suggestion.title}
          </h4>
          <p className="text-xs font-medium text-white/40 leading-relaxed tracking-tight line-clamp-2">
            {suggestion.description}
          </p>
        </div>

        <button className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
          {suggestion.actionLabel}
        </button>
      </div>

      {/* Decorative corner sparkles */}
      <Sparkles className="absolute bottom-4 right-6 w-4 h-4 text-white/5 group-hover:text-primary/20 transition-colors duration-500" />
    </div>
  );
}
