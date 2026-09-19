'use client';

import React from 'react';
import { Barber } from '@/types/barber';
import {
  Scissors,
  Phone,
  Calendar,
  Sparkles,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarberListProps {
  barbers: Barber[];
  isLoading: boolean;
  onEdit: (barber: Barber) => void;
  onManageServices: (barber: Barber) => void;
  onManageSchedules: (barber: Barber) => void;
  onDelete: (id: number) => void;
}

export function BarberList({
  barbers,
  isLoading,
  onEdit,
  onManageServices,
  onManageSchedules,
  onDelete,
}: BarberListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-48 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
          <Scissors className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No hay barberos registrados</h4>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
          Comienza agregando los profesionales del equipo para asignarles servicios y horarios.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {barbers.map((barber) => {
        const serviceCount = barber.services?.length || 0;
        const scheduleCount = barber.schedules?.length || 0;

        return (
          <div
            key={barber.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/30 hover:bg-zinc-900 shadow-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 text-amber-400 font-bold text-lg">
                    {barber.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {barber.name}
                    </h4>
                    <p className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                      <Phone className="w-3 h-3 text-zinc-400" />
                      {barber.phone || 'Sin teléfono'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    barber.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {barber.active ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Activo
                    </>
                  ) : (
                    'Inactivo'
                  )}
                </span>
              </div>

              {/* Stats badges */}
              <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/60 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-white">{serviceCount}</div>
                    <div className="text-[10px] text-zinc-400">Servicios</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold text-white">{scheduleCount} días</div>
                    <div className="text-[10px] text-zinc-400">Horario semanal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="mt-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManageServices(barber)}
                  className="h-8 text-[11px] px-2.5 border-zinc-800 hover:bg-zinc-800 hover:text-amber-300"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                  Servicios
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManageSchedules(barber)}
                  className="h-8 text-[11px] px-2.5 border-zinc-800 hover:bg-zinc-800 hover:text-blue-300"
                >
                  <Clock className="w-3 h-3 mr-1 text-blue-400" />
                  Horarios
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(barber)}
                  className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  title="Editar datos"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`¿Eliminar al barbero ${barber.name}?`)) {
                      onDelete(barber.id);
                    }
                  }}
                  className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
