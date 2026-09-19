'use client';

import React, { useState, useEffect } from 'react';
import { Barber, CreateBarberPayload, UpdateBarberPayload } from '@/types/barber';
import { barberApi } from '@/lib/api';
import { X, UserPlus, Scissors, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarberModalProps {
  barber: Barber | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BarberModal({
  barber,
  isOpen,
  onClose,
  onSuccess,
}: BarberModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (barber) {
      setName(barber.name);
      setPhone(barber.phone || '');
      setActive(barber.active);
    } else {
      setName('');
      setPhone('');
      setActive(true);
    }
    setError(null);
  }, [barber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del barbero es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (barber) {
        await barberApi.update(barber.id, {
          name: name.trim(),
          phone: phone.trim() || undefined,
          active,
        });
      } else {
        await barberApi.create({
          name: name.trim(),
          phone: phone.trim() || undefined,
          active,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el barbero');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {barber ? 'Editar Barbero' : 'Registrar Nuevo Barbero'}
              </h3>
              <p className="text-xs text-zinc-400">
                Información del profesional del equipo
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nombre Completo *
            </label>
            <input
              type="text"
              placeholder="Ej. 'Carlos Mendoza'"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Teléfono Celular
            </label>
            <input
              type="tel"
              placeholder="Ej. '+57 300 123 4567'"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div>
              <div className="text-xs font-semibold text-zinc-200">Estado Activo</div>
              <div className="text-[11px] text-zinc-400">
                Los barberos inactivos no aparecerán disponibles para agendar citas
              </div>
            </div>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500 accent-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
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
              <span>{barber ? 'Guardar Cambios' : 'Crear Barbero'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
