'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Command } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ChatProps {
  onQuery: (text: string) => void;
  isPending?: boolean;
}

export default function Chat({ onQuery, isPending }: ChatProps) {
  const [query, setQuery] = useState('');
  const lastSubmitTime = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    
    // 300ms debounce to prevent rapid Enter key presses
    if (now - lastSubmitTime.current < 300) return;
    
    if (query.trim() && !isPending) {
      lastSubmitTime.current = now;
      onQuery(query);
      setQuery('');
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-auto pt-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={cn(
          "relative glass-card bg-surface-highest/40 rounded-[2.5rem] p-1 shadow-2xl transition-all duration-500",
          "ring-1 ring-white/5 group-focus-within:ring-primary/40 group-focus-within:bg-surface-highest/60 group-focus-within:shadow-[0_0_50px_rgba(136,173,255,0.15)]",
          isPending && "animate-pulse"
        )}>
          <div className="flex items-center gap-4 px-6 py-4">
            <Sparkles className={cn(
              "w-5 h-5 transition-colors duration-300",
              isPending ? "text-primary animate-spin" : "text-white/40 group-focus-within:text-primary"
            )} />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything or use Command+K"
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-white/20 text-white"
              disabled={isPending}
            />

            <div className="flex items-center gap-2">
              {!query && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!query || isPending}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  query && !isPending 
                    ? "soul-gradient text-white shadow-lg shadow-primary/20 scale-100" 
                    : "bg-white/5 text-white/20 scale-90"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative glow beneath the input */}
        <div className="absolute -bottom-2 lg:left-12 lg:right-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
      </form>
    </div>
  );
}
