'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client, CreateClientPayload, UpdateClientPayload } from '@/types/client';
import { clientApi } from '@/lib/api';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientApi.getAll();
      setClients(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (payload: CreateClientPayload) => {
    const created = await clientApi.create(payload);
    await fetchClients();
    return created;
  };

  const updateClient = async (id: number, payload: UpdateClientPayload) => {
    const updated = await clientApi.update(id, payload);
    await fetchClients();
    return updated;
  };

  const deleteClient = async (id: number) => {
    const deleted = await clientApi.delete(id);
    await fetchClients();
    return deleted;
  };

  return {
    clients,
    isLoading,
    error,
    refresh: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
