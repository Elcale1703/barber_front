'use client';

import React, { useState, useEffect } from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '@/context/AuthContext';
import { Plus, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { serviceApi } from '@/lib/api';

export function Header({
  title,
  subtitle,
  onNewAppointment,
}: {
  title?: string;
  subtitle?: string;
  onNewAppointment?: () => void;
}) {
  const { role } = useAuth();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Check backend connectivity
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await serviceApi.getAll();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-18 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        {title && <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>}
        {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Backend status indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-zinc-900/80 border-zinc-800"
          title={backendOnline ? 'NestJS backend connected' : 'NestJS backend not detected at localhost:3000'}
        >
          {backendOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 hidden sm:inline">API Online</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="text-zinc-400 hidden sm:inline">API Standby</span>
            </>
          )}
        </div>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* New Appointment Button */}
        {onNewAppointment && (
          <Button
            onClick={onNewAppointment}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-semibold shadow-lg shadow-amber-500/10 gap-1.5 h-9"
          >
            <Plus className="w-4 h-4 text-zinc-950" />
            <span>Book Appointment</span>
          </Button>
        )}
      </div>
    </header>
  );
}
