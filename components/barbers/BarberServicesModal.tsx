'use client';

import React, { useState, useEffect } from 'react';
import { Barber } from '@/types/barber';
import { Service } from '@/types/service';
import { barberApi, serviceApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { X, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarberServicesModalProps {
  barber: Barber | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BarberServicesModal({
  barber,
  isOpen,
  onClose,
  onSuccess,
}: BarberServicesModalProps) {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && barber) {
      serviceApi.getAll().then(setAllServices).catch(() => {});
      // Pre-select already assigned services
      const currentServiceIds = barber.services?.map((bs) => bs.serviceId) || [];
      setSelectedServiceIds(currentServiceIds);
      setError(null);
    }
  }, [isOpen, barber]);

  if (!isOpen || !barber) return null;

  const toggleService = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedServiceIds.length === allServices.length) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(allServices.map((s) => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await barberApi.assignServices(barber.id, selectedServiceIds);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al asignar los servicios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Servicios Asignados</h3>
              <p className="text-xs text-zinc-400">
                Selecciona los servicios que puede realizar {barber.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{selectedServiceIds.length} servicios seleccionados</span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-amber-400 hover:text-amber-300 font-semibold"
          >
            {selectedServiceIds.length === allServices.length
              ? 'Deseleccionar todos'
              : 'Seleccionar todos'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {allServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);

              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-400 text-zinc-950'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-200">
                        {service.name}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {service.duration} min • {formatCurrency(service.price)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-400">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs border-zinc-800 hover:bg-zinc-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Asignaciones</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
