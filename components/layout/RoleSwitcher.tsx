'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { barberApi } from '@/lib/api';
import { Barber } from '@/types/barber';
import { ShieldCheck, Scissors, ArrowRightLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RoleSwitcher({ className }: { className?: string }) {
  const { user, role, switchRole } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    barberApi.getAll().then((data) => setBarbers(data)).catch(() => {});
  }, []);

  const handleSelectAdmin = () => {
    switchRole('ADMIN');
    setIsOpen(false);
  };

  const handleSelectBarber = (b: Barber) => {
    switchRole('BARBER', b.id, b.name);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 text-xs font-medium text-zinc-200 transition-all hover:scale-[1.02] shadow-sm"
        title="Cambiar entre Administrador y Barberos"
      >
        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
        <span>Rol actual:</span>
        <span className="font-semibold text-amber-400">
          {role === 'ADMIN' ? 'Admin' : `Barbero: ${user?.name || 'Staff'}`}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Simulador de Roles (JWT)
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <button
                onClick={handleSelectAdmin}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                  role === 'ADMIN'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                )}
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Administrador Global</div>
                  <div className="text-[10px] text-zinc-400">
                    Acceso total a finanzas, barberos y servicios
                  </div>
                </div>
              </button>

              <div className="pt-2 pb-1 text-[11px] font-semibold text-zinc-400 px-1 flex items-center gap-1">
                <Scissors className="w-3 h-3 text-zinc-400" />
                Barberos Registrados
              </div>

              {barbers.length === 0 ? (
                <button
                  onClick={() => handleSelectBarber({ id: 1, name: 'Carlos Mendoza', active: true, createdAt: '', updatedAt: '' })}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800/60 hover:text-white text-left"
                >
                  <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold">Barbero #1 (Default)</div>
                    <div className="text-[10px] text-zinc-400">Agenda personal y métricas</div>
                  </div>
                </button>
              ) : (
                barbers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBarber(b)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                      role === 'BARBER' && user?.barberId === b.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                    )}
                  >
                    <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold truncate">{b.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {b.phone || `ID: #${b.id}`} • {b.active ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
