'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Scissors,
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  Clock,
  UserCheck,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const adminNavItems: NavItem[] = [
    { label: 'Visión General', href: '/admin', icon: LayoutDashboard },
    { label: 'Citas & Agenda', href: '/admin/appointments', icon: Calendar },
    { label: 'Barberos', href: '/admin/barbers', icon: Users },
    { label: 'Servicios', href: '/admin/services', icon: Sparkles },
    { label: 'Clientes', href: '/admin/clients', icon: UserCheck },
  ];

  const barberNavItems: NavItem[] = [
    { label: 'Mi Agenda', href: '/barber', icon: Calendar },
    { label: 'Mis Horarios', href: '/barber/schedule', icon: Clock },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : barberNavItems;

  return (
    <aside
      className={cn(
        'flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/90 backdrop-blur-xl h-screen sticky top-0',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-18 border-b border-zinc-800/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 shadow-md shadow-amber-500/20">
          <Scissors className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            BARBERÍA <span className="text-amber-400">PRO</span>
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            {role === 'ADMIN' ? 'Panel de Administración' : 'Portal del Barbero'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Menú Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-300'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 border border-zinc-700/60 font-semibold text-xs">
            {role === 'ADMIN' ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : (
              <User className="w-5 h-5 text-zinc-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              {role === 'ADMIN' ? 'Super Administrador' : `Barbero (ID: #${user?.barberId})`}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
