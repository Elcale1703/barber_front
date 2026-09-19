'use client';

import React, { useState, useEffect } from 'react';
import { Service, CreateServicePayload, UpdateServicePayload } from '@/types/service';
import { serviceApi } from '@/lib/api';
import { X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceModal({
  service,
  isOpen,
  onClose,
  onSuccess,
}: ServiceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [price, setPrice] = useState<number>(30000);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description || '');
      setDuration(service.duration);
      setPrice(service.price);
      setActive(service.active);
    } else {
      setName('');
      setDescription('');
      setDuration(30);
      setPrice(30000);
      setActive(true);
    }
    setError(null);
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del servicio es obligatorio');
      return;
    }
    if (duration <= 0) {
      setError('La duración debe ser mayor a 0 minutos');
      return;
    }
    if (price < 0) {
      setError('El precio debe ser mayor o igual a 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (service) {
        await serviceApi.update(service.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          duration: Number(duration),
          price: Number(price),
          active,
        });
      } else {
        await serviceApi.create({
          name: name.trim(),
          description: description.trim() || undefined,
          duration: Number(duration),
          price: Number(price),
          active,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el servicio');
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {service ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <p className="text-xs text-zinc-400">
                Catálogo de cortes, afeitados y tratamientos
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
              Nombre del Servicio *
            </label>
            <input
              type="text"
              placeholder="Ej. 'Corte Clásico & Barba'"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Descripción
            </label>
            <textarea
              rows={2}
              placeholder="Ej. 'Incluye lavado, perfilado con toalla caliente y styling final'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Duración (minutos) *
              </label>
              <input
                type="number"
                step="5"
                min="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Precio (COP) *
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div>
              <div className="text-xs font-semibold text-zinc-200">Servicio Activo</div>
              <div className="text-[11px] text-zinc-400">
                Los servicios inactivos no se pueden seleccionar al agendar citas
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
              <span>{service ? 'Guardar Cambios' : 'Crear Servicio'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
