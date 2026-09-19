'use client';

import { useState, useEffect, useCallback } from 'react';
import { Service, CreateServicePayload, UpdateServicePayload } from '@/types/service';
import { serviceApi } from '@/lib/api';

export function useServices(activeOnly: boolean = false) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await serviceApi.getAll(activeOnly);
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar servicios');
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (payload: CreateServicePayload) => {
    const created = await serviceApi.create(payload);
    await fetchServices();
    return created;
  };

  const updateService = async (id: number, payload: UpdateServicePayload) => {
    const updated = await serviceApi.update(id, payload);
    await fetchServices();
    return updated;
  };

  const deleteService = async (id: number) => {
    const deleted = await serviceApi.delete(id);
    await fetchServices();
    return deleted;
  };

  return {
    services,
    isLoading,
    error,
    refresh: fetchServices,
    createService,
    updateService,
    deleteService,
  };
}
