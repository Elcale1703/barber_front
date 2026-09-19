'use client';

import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { appointmentApi } from '@/lib/api';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpdateStatusModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_STATUSES: { status: AppointmentStatus; label: string; desc: string }[] = [
  { status: 'CONFIRMED', label: 'Confirmada', desc: 'Cliente reservó o confirmó su asistencia' },
  { status: 'COMPLETED', label: 'Completada', desc: 'Servicio finalizado exitosamente' },
  { status: 'PENDING', label: 'Pendiente', desc: 'Pendiente de confirmación con el cliente' },
  { status: 'NO_SHOW', label: 'No Asistió', desc: 'El cliente no se presentó al turno' },
  { status: 'CANCELLED', label: 'Cancelada', desc: 'Cita cancelada por cliente o barbería' },
];

export function UpdateStatusModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: UpdateStatusModalProps) {
  const [status, setStatus] = useState<AppointmentStatus>(
    appointment?.status || 'CONFIRMED'
  );
  const [notes, setNotes] = useState<string>(appointment?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state on change
  React.useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setNotes(appointment.notes || '');
      setError(null);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await appointmentApi.updateStatus(appointment.id, {
        status,
        notes: notes.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white">Actualizar Estado de la Cita</h3>
            <p className="text-xs text-zinc-400">
              Cita #{appointment.id} • {appointment.client?.name || 'Cliente'}
            </p>
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
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Seleccionar nuevo estado
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ALL_STATUSES.map((item) => (
                <label
                  key={item.status}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    status === item.status
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="status"
                      value={item.status}
                      checked={status === item.status}
                      onChange={() => setStatus(item.status)}
                      className="accent-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-200">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <AppointmentStatusBadge status={item.status} showIcon={false} />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Notas adicionales (opcional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. 'Cliente reprogramó', 'Realizó pago en efectivo'..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
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
              <span>Guardar Cambios</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
