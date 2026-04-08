'use client';

import React from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface TimelineProps {
  events: Event[];
}

export default function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 soul-gradient rounded-full" />
          <h3 className="font-headline text-lg font-bold tracking-tight">Today's Schedule</h3>
          <CalendarDays className="w-4 h-4 text-white/40" />
        </div>
        <button className="text-xs font-bold text-primary tracking-widest uppercase hover:underline">View All</button>
      </div>

      <div className="relative pl-8 space-y-4">
        {sortedEvents.map((event, idx) => {
          const startDate = new Date(event.startTime);
          const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={event.id} className="relative group pb-6 last:pb-0">
              {/* Time Indicator Node - Clean & Single */}
              <div className="absolute -left-8 top-1.5 flex flex-col items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(136,173,255,0.5)] z-10 group-hover:scale-125 transition-transform duration-300" />
              </div>

              <div className="glass-card bg-surface-highest/40 p-5 rounded-[2rem] ring-1 ring-white/5 group-hover:ring-primary/20 group-hover:bg-surface-highest/60 transition-all duration-500">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-primary tracking-widest uppercase">{timeStr}</p>
                      <h4 className="font-medium text-white group-hover:text-primary transition-colors">{event.title}</h4>
                    </div>
                    <button className="text-white/20 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-medium text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary/60" />
                      <span>{timeStr} — {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}


        {sortedEvents.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-20 pr-12">
            <CalendarDays className="w-16 h-16" />
            <p className="font-headline text-lg font-bold tracking-tight text-glow">Memory Clear</p>
            <p className="text-sm font-medium tracking-tight">No upcoming events scheduled for this session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
