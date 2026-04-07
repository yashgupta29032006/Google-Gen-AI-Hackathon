'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Calendar as CalendarIcon, Tag, MoreHorizontal, Plus } from 'lucide-react'

export default function Dashboard({ lifeMode }: { lifeMode: string }) {
  const [tasks, setTasks] = useState<any[]>([
    { id: '1', title: 'Finish Hackathon Project', priority: 'CRITICAL', status: 'IN_PROGRESS', deadline: 'Today, 6:00 PM' },
    { id: '2', title: 'Buy groceries', priority: 'LOW', status: 'TODO', deadline: 'Tomorrow' },
    { id: '3', title: 'Call Mom', priority: 'MEDIUM', status: 'TODO', deadline: 'Sunday' }
  ])

  const [events, setEvents] = useState<any[]>([
    { id: '101', title: 'Team Standup', startTime: '09:00', endTime: '09:30', project: 'RUDRA' },
    { id: '102', title: 'Deep Work Session', startTime: '10:00', endTime: '12:00', project: 'Research' },
    { id: '103', title: 'Lunch Break', startTime: '12:30', endTime: '13:30', project: 'Personal' }
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Task Section */}
      <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
        <div className="glass modern-card p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold flex items-center gap-3">
              Active Tasks <span className="bg-violet-500/20 text-violet-400 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
            </h2>
            <button className="p-2 glass rounded-xl text-violet-400 hover:text-white transition-all">
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {tasks.map(task => (
              <div key={task.id} className="glass p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-violet-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <button className="text-slate-600 hover:text-violet-500 transition-colors">
                    <CheckCircle2 size={24} />
                  </button>
                  <div>
                    <h3 className="font-semibold text-slate-100 group-hover:text-violet-400 transition-colors">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <span className={`px-2 py-0.5 rounded-full ${task.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                        {task.priority}
                      </span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {task.deadline}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-600 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Knowledge Quick Links (Simplified) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Note</h3>
              <p className="text-sm text-slate-300 italic">"Focus on the agentic communication layer for the demo."</p>
              <div className="flex gap-2">
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg">#hackathon</span>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg">#strategy</span>
              </div>
          </div>
          <div className="glass p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-transparent flex flex-col justify-center">
              <p className="text-xs font-semibold text-violet-400 uppercase mb-1">RUDRA Suggestion</p>
              <h4 className="font-bold text-slate-100">"You usually exercise at 5 PM. Should I clear your calendar?"</h4>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
        <div className="glass modern-card p-6 h-full min-h-[400px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <CalendarIcon size={20} className="text-violet-500" /> Today's Schedule
          </h2>
          
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-slate-800"></div>
            {events.map((event, i) => (
              <div key={event.id} className="relative pl-12">
                <div className="absolute left-[13px] top-[14px] w-1.5 h-1.5 rounded-full bg-violet-500 ring-4 ring-violet-500/20"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500">{event.startTime} - {event.endTime}</span>
                  <div className="glass p-4 rounded-2xl border-l-4 border-violet-500 bg-violet-500/5 group hover:bg-violet-500/10 transition-all">
                    <h4 className="font-bold text-slate-100 group-hover:text-violet-400 transition-colors">{event.title}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1 block">{event.project}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 glass p-4 rounded-2xl text-slate-400 hover:text-white transition-all font-semibold flex items-center justify-center gap-2">
            <Plus size={18} /> Plan My Day
          </button>
        </div>
      </div>
    </div>
  )
}
