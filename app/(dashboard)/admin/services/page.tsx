'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceModal } from '@/components/services/ServiceModal';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServicesManagementPage() {
  const { services, isLoading, refresh, deleteService } = useServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenCreate = () => {
    setSelectedService(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <div className="min-h-full pb-12">
      <Header
        title="Servicios & Tarifas"
        subtitle="Administra la carta de servicios, precios en COP y duración en minutos"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Carta de Servicios ({services.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Estos servicios podrán ser asignados a los barberos y reservados por clientes
            </p>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </Button>
        </div>

        {/* Services Grid */}
        <ServiceList
          services={services}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={deleteService}
        />
      </div>

      {/* Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
