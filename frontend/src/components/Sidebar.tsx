'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Search, 
  Settings, 
  Zap,
  Activity
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Planner', icon: Calendar, href: '/planner' },
  { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { name: 'Knowledge', icon: Search, href: '/knowledge' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen glass border-r-0 ring-1 ring-white/5 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 soul-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Zap className="text-white w-6 h-6 fill-white" />
        </div>
        <h1 className="font-headline text-xl font-bold tracking-tight text-glow">RUDRA OS</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-primary" : "text-white/40 group-hover:text-white"
              )} />
              <span className="font-medium tracking-wide">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(136,173,255,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="px-4 py-4 rounded-3xl bg-surface-lowest/50 border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-white/40 uppercase tracking-widest">
            <span>System Status</span>
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[78%] soul-gradient rounded-full" />
            </div>
            <p className="text-[10px] text-white/30 font-medium tracking-tight">Core Processing: 78% Capacity</p>
          </div>
        </div>
        
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
            pathname === '/settings' ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium tracking-wide">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
