'use client';

import { useState, useEffect, useCallback } from 'react';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentStatusPayload } from '@/types/appointment';
import { appointmentApi } from '@/lib/api';

export function useAppointments(filters?: {
  barberId?: number;
  clientId?: number;
  status?: string;
  from?: string;
  to?: string;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentApi.getAll(filters);
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.barberId, filters?.clientId, filters?.status, filters?.from, filters?.to]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (payload: CreateAppointmentPayload) => {
    const newAppointment = await appointmentApi.create(payload);
    await fetchAppointments();
    return newAppointment;
  };

  const updateStatus = async (id: number, payload: UpdateAppointmentStatusPayload) => {
    const updated = await appointmentApi.updateStatus(id, payload);
    await fetchAppointments();
    return updated;
  };

  const cancelAppointment = async (id: number, reason?: string) => {
    const cancelled = await appointmentApi.cancel(id, reason);
    await fetchAppointments();
    return cancelled;
  };

  return {
    appointments,
    isLoading,
    error,
    refresh: fetchAppointments,
    createAppointment,
    updateStatus,
    cancelAppointment,
  };
}
