'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 p-12 flex flex-col items-center justify-center space-y-4 opacity-40 selection:bg-primary/20 selection:text-primary">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-glow uppercase">OS Configuration</h1>
        <p className="font-medium tracking-tight text-lg">Coming soon: Multi-Model Switching & Webhook Hubs</p>
      </main>
    </div>
  );
}
