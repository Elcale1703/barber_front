'use client';

import React, { useState, useEffect } from 'react';
import { barberApi, serviceApi, clientApi, appointmentApi } from '@/lib/api';
import { Barber } from '@/types/barber';
import { Service } from '@/types/service';
import { Client } from '@/types/client';
import { CreateAppointmentPayload } from '@/types/appointment';
import { AvailabilitySlots } from './AvailabilitySlots';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  Phone,
  Mail,
  FileText,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultBarberId?: number;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultBarberId,
}: NewAppointmentModalProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Form state
  const [selectedBarberId, setSelectedBarberId] = useState<number | undefined>(defaultBarberId);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);

  // Client mode: existing or new
  const [isNewClient, setIsNewClient] = useState<boolean>(true);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      barberApi.getAll(true).then(setBarbers).catch(() => {});
      serviceApi.getAll(true).then(setServices).catch(() => {});
      clientApi.getAll().then(setClients).catch(() => {});

      if (defaultBarberId) {
        setSelectedBarberId(defaultBarberId);
      }
      setSelectedStartTime(null);
      setError(null);
    }
  }, [isOpen, defaultBarberId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId) {
      setError('Debes seleccionar un barbero');
      return;
    }
    if (!selectedServiceId) {
      setError('Debes seleccionar un servicio');
      return;
    }
    if (!selectedStartTime) {
      setError('Debes seleccionar un turno disponible');
      return;
    }

    if (!isNewClient && !selectedClientId) {
      setError('Debes seleccionar un cliente existente');
      return;
    }

    if (isNewClient) {
      if (!clientName.trim()) {
        setError('El nombre del cliente es obligatorio');
        return;
      }
      if (!clientPhone.trim()) {
        setError('El teléfono del cliente es obligatorio');
        return;
      }
    }

    setLoading(true);
    setError(null);

    const payload: CreateAppointmentPayload = {
      barberId: Number(selectedBarberId),
      serviceId: Number(selectedServiceId),
      startTime: selectedStartTime,
      notes: notes.trim() || undefined,
      source: 'DASHBOARD',
    };

    if (isNewClient) {
      payload.clientName = clientName.trim();
      payload.clientPhone = clientPhone.trim();
      if (clientEmail.trim()) {
        payload.clientEmail = clientEmail.trim();
      }
    } else {
      payload.clientId = Number(selectedClientId);
    }

    try {
      await appointmentApi.create(payload);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'No se pudo agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agendar Nueva Cita</h3>
              <p className="text-xs text-zinc-400">
                Reserva un turno con cálculo automático de disponibilidad
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
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Barber & Service Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Barbero
              </label>
              <select
                value={selectedBarberId || ''}
                onChange={(e) => {
                  setSelectedBarberId(Number(e.target.value) || undefined);
                  setSelectedStartTime(null);
                }}
                disabled={!!defaultBarberId}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="">-- Seleccionar Barbero --</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Servicio
              </label>
              <select
                value={selectedServiceId || ''}
                onChange={(e) => {
                  setSelectedServiceId(Number(e.target.value) || undefined);
                  setSelectedStartTime(null);
                }}
                className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="">-- Seleccionar Servicio --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} min - {formatCurrency(s.price)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Fecha de la Cita
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedStartTime(null);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Dynamic Slots */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3.5">
            <AvailabilitySlots
              barberId={selectedBarberId}
              serviceId={selectedServiceId}
              date={selectedDate}
              selectedSlot={selectedStartTime}
              onSelectSlot={(slotIso) => setSelectedStartTime(slotIso)}
            />
          </div>

          {/* Client Details Section */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Datos del Cliente
              </span>
              <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewClient(true)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    isNewClient ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Nuevo
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewClient(false)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    !isNewClient ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  Existente
                </button>
              </div>
            </div>

            {isNewClient ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Teléfono móvil *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="email"
                    placeholder="Correo electrónico (opcional)"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => setSelectedClientId(Number(e.target.value) || undefined)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Seleccionar de clientes registrados --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Notas / Preferencias (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. 'Corte degradado bajo con navaja'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
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
              disabled={loading || !selectedStartTime}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirmar Cita</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
