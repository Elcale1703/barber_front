'use client';

import React from 'react';
import { Service } from '@/types/service';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Clock, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceListProps {
  services: Service[];
  isLoading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

export function ServiceList({
  services,
  isLoading,
  onEdit,
  onDelete,
}: ServiceListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-36 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No services found</h4>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
          Add haircuts, shaves and treatments to the barbershop service menu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/30 hover:bg-zinc-900 shadow-sm"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {service.name}
              </h4>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${service.active
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
              >
                {service.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {service.description && (
              <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-zinc-800/60">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {service.duration} minutes
              </span>
              <span className="text-sm font-bold text-amber-400">
                {formatCurrency(service.price)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(service)}
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Editar servicio"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                if (confirm(`¿Eliminar el servicio "${service.name}"?`)) {
                  onDelete(service.id);
                }
              }}
              className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
              title="Eliminar servicio"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
