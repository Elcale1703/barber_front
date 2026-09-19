'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Barber,
  CreateBarberPayload,
  UpdateBarberPayload,
  SetSchedulesPayload,
} from '@/types/barber';
import { barberApi } from '@/lib/api';

export function useBarbers(activeOnly: boolean = false) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarbers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await barberApi.getAll(activeOnly);
      setBarbers(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar barberos');
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const createBarber = async (payload: CreateBarberPayload) => {
    const created = await barberApi.create(payload);
    await fetchBarbers();
    return created;
  };

  const updateBarber = async (id: number, payload: UpdateBarberPayload) => {
    const updated = await barberApi.update(id, payload);
    await fetchBarbers();
    return updated;
  };

  const assignServices = async (id: number, serviceIds: number[]) => {
    const result = await barberApi.assignServices(id, serviceIds);
    await fetchBarbers();
    return result;
  };

  const setSchedules = async (id: number, payload: SetSchedulesPayload) => {
    const result = await barberApi.setSchedules(id, payload);
    await fetchBarbers();
    return result;
  };

  const deleteBarber = async (id: number) => {
    const result = await barberApi.delete(id);
    await fetchBarbers();
    return result;
  };

  return {
    barbers,
    isLoading,
    error,
    refresh: fetchBarbers,
    createBarber,
    updateBarber,
    assignServices,
    setSchedules,
    deleteBarber,
  };
}
