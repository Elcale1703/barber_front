'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BarberList } from '@/components/barbers/BarberList';
import { BarberModal } from '@/components/barbers/BarberModal';
import { BarberServicesModal } from '@/components/barbers/BarberServicesModal';
import { BarberScheduleModal } from '@/components/barbers/BarberScheduleModal';
import { useBarbers } from '@/hooks/useBarbers';
import { Barber } from '@/types/barber';
import { Scissors, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BarbersManagementPage() {
  const { barbers, isLoading, refresh, deleteBarber } = useBarbers();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [schedulesModalOpen, setSchedulesModalOpen] = useState(false);
  const [activeBarberForSubModal, setActiveBarberForSubModal] = useState<Barber | null>(null);

  const handleOpenCreate = () => {
    setSelectedBarber(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (barber: Barber) => {
    setSelectedBarber(barber);
    setModalOpen(true);
  };

  const handleManageServices = (barber: Barber) => {
    setActiveBarberForSubModal(barber);
    setServicesModalOpen(true);
  };

  const handleManageSchedules = (barber: Barber) => {
    setActiveBarberForSubModal(barber);
    setSchedulesModalOpen(true);
  };

  return (
    <div className="min-h-full pb-12">
      <Header
        title="Equipo de Barberos"
        subtitle="Gestión de profesionales, asignación de servicios y horarios semanales"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Barberos Registrados ({barbers.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Configura los turnos laborales y las habilidades de cada barbero
            </p>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5 h-9"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Barbero</span>
          </Button>
        </div>

        {/* Barbers Cards List */}
        <BarberList
          barbers={barbers}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onManageServices={handleManageServices}
          onManageSchedules={handleManageSchedules}
          onDelete={deleteBarber}
        />
      </div>

      {/* Modals */}
      <BarberModal
        barber={selectedBarber}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refresh()}
      />

      <BarberServicesModal
        barber={activeBarberForSubModal}
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        onSuccess={() => refresh()}
      />

      <BarberScheduleModal
        barber={activeBarberForSubModal}
        isOpen={schedulesModalOpen}
        onClose={() => setSchedulesModalOpen(false)}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
