'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ClientList } from '@/components/clients/ClientList';
import { ClientModal } from '@/components/clients/ClientModal';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types/client';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClientsManagementPage() {
  const { clients, isLoading, refresh, deleteClient } = useClients();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleOpenCreate = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  return (
    <div className="min-h-full pb-12">
      <Header
        title="Directorio de Clientes"
        subtitle="Registro de clientes, datos de contacto y fidelización"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Clientes Registrados ({clients.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Busca por número de teléfono o añade un nuevo cliente a la base de datos
            </p>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5 h-9"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </Button>
        </div>

        {/* Clients Table */}
        <ClientList
          clients={clients}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={deleteClient}
        />
      </div>

      {/* Modal */}
      <ClientModal
        client={selectedClient}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
