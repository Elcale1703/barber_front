'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BarberMetrics } from '@/components/dashboard/BarberMetrics';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';
import { UpdateStatusModal } from '@/components/appointments/UpdateStatusModal';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/context/AuthContext';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Scissors, Calendar, Clock, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BarberPortalPage() {
  const { user } = useAuth();
  const barberId = user?.barberId || 1;

  const [filterMode, setFilterMode] = useState<'today' | 'all' | 'pending'>('today');

  const todayStr = new Date().toISOString().split('T')[0];

  const { appointments, isLoading, refresh, updateStatus, cancelAppointment } = useAppointments({
    barberId,
    from: filterMode === 'today' ? `${todayStr}T00:00:00Z` : undefined,
    to: filterMode === 'today' ? `${todayStr}T23:59:59Z` : undefined,
    status: filterMode === 'pending' ? 'CONFIRMED' : undefined,
  });

  const [newAptModalOpen, setNewAptModalOpen] = useState(false);
  const [selectedAptForStatus, setSelectedAptForStatus] = useState<Appointment | null>(null);

  return (
    <div className="min-h-full pb-12">
      <Header
        title={`My Schedule • ${user?.name || 'Barber Staff'}`}
        subtitle="Assigned shifts, today's clients and personal metrics for your chair"
        onNewAppointment={() => setNewAptModalOpen(true)}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Personalized Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Scissors className="w-4 h-4" />
                <span>Barber Workspace</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Hello, {user?.name || 'Colleague'}! 💈
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Here's a summary of your workday and the list of clients you'll attend today.
              </p>
            </div>

            <Button
              onClick={() => setNewAptModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs gap-1.5 h-10 px-4 rounded-xl shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Book Walk-in Client</span>
            </Button>
          </div>
        </div>

        {/* Barber Personal KPIs */}
        <BarberMetrics appointments={appointments} />

        {/* Agenda Section */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                My Scheduled Appointments
              </h3>
              <p className="text-xs text-zinc-400">
                Update status as the client arrives or when you finish the cut
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
              <button
                onClick={() => setFilterMode('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'today'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Today's Appointments
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'pending'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Full History
              </button>
            </div>
          </div>

          <AppointmentList
            appointments={appointments}
            isLoading={isLoading}
            onUpdateStatus={(apt) => setSelectedAptForStatus(apt)}
            onCancel={(id) => cancelAppointment(id)}
            showBarberCol={false}
          />
        </div>
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={newAptModalOpen}
        onClose={() => setNewAptModalOpen(false)}
        onSuccess={() => refresh()}
        defaultBarberId={barberId}
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
