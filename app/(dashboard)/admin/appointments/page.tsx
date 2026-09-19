'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';
import { UpdateStatusModal } from '@/components/appointments/UpdateStatusModal';
import { useAppointments } from '@/hooks/useAppointments';
import { useBarbers } from '@/hooks/useBarbers';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Calendar, Filter, Plus, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_TABS: { label: string; status?: AppointmentStatus }[] = [
  { label: 'Todas' },
  { label: 'Confirmadas', status: 'CONFIRMED' },
  { label: 'Pendientes', status: 'PENDING' },
  { label: 'Completadas', status: 'COMPLETED' },
  { label: 'Canceladas', status: 'CANCELLED' },
  { label: 'No Asistió', status: 'NO_SHOW' },
];

export function AppointmentsManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | undefined>(undefined);
  const [selectedBarberId, setSelectedBarberId] = useState<number | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<string>('');

  const { appointments, isLoading, refresh, cancelAppointment } = useAppointments({
    status: selectedStatus,
    barberId: selectedBarberId,
    from: dateFilter ? `${dateFilter}T00:00:00Z` : undefined,
    to: dateFilter ? `${dateFilter}T23:59:59Z` : undefined,
  });

  const { barbers } = useBarbers();

  const [newAptModalOpen, setNewAptModalOpen] = useState(false);
  const [selectedAptForStatus, setSelectedAptForStatus] = useState<Appointment | null>(null);

  const resetFilters = () => {
    setSelectedStatus(undefined);
    setSelectedBarberId(undefined);
    setDateFilter('');
  };

  return (
    <div className="min-h-full pb-12">
      <Header
        title="Gestión de Citas & Agenda"
        subtitle="Monitoreo, programación y actualización de estados en tiempo real"
        onNewAppointment={() => setNewAptModalOpen(true)}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Filters and Tabs Bar */}
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-5 backdrop-blur-xl">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 border-b border-zinc-800/60">
            {STATUS_TABS.map((tab) => {
              const isActive = selectedStatus === tab.status;
              return (
                <button
                  key={tab.label}
                  onClick={() => setSelectedStatus(tab.status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Barber & Date */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Barbero:</span>
                <select
                  value={selectedBarberId || ''}
                  onChange={(e) =>
                    setSelectedBarberId(Number(e.target.value) || undefined)
                  }
                  className="h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Todos los barberos</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Fecha:</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {(selectedStatus || selectedBarberId || dateFilter) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="text-xs text-zinc-400 font-medium">
              {appointments.length} citas encontradas
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <AppointmentList
          appointments={appointments}
          isLoading={isLoading}
          onUpdateStatus={(apt) => setSelectedAptForStatus(apt)}
          onCancel={(id) => cancelAppointment(id)}
          showBarberCol={true}
        />
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={newAptModalOpen}
        onClose={() => setNewAptModalOpen(false)}
        onSuccess={() => refresh()}
      />

      <UpdateStatusModal
        appointment={selectedAptForStatus}
        isOpen={!!selectedAptForStatus}
        onClose={() => setSelectedAptForStatus(null)}
        onSuccess={() => refresh()}
      />
    </div>
  );
}

export default AppointmentsManagementPage;
