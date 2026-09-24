'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { AdminMetrics } from '@/components/dashboard/AdminMetrics';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';
import { UpdateStatusModal } from '@/components/appointments/UpdateStatusModal';
import { useAppointments } from '@/hooks/useAppointments';
import { useBarbers } from '@/hooks/useBarbers';
import { useServices } from '@/hooks/useServices';
import { useClients } from '@/hooks/useClients';
import { Appointment } from '@/types/appointment';
import {
  Calendar,
  Users,
  Sparkles,
  Scissors,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminOverviewPage() {
  const { appointments, isLoading: aptsLoading, refresh: refreshApts, updateStatus, cancelAppointment } = useAppointments();
  const { barbers, isLoading: barbersLoading, refresh: refreshBarbers } = useBarbers();
  const { services, isLoading: servicesLoading } = useServices();
  const { clients, isLoading: clientsLoading } = useClients();

  // Modals state
  const [newAptModalOpen, setNewAptModalOpen] = useState(false);
  const [selectedAptForStatus, setSelectedAptForStatus] = useState<Appointment | null>(null);

  // Today's appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) =>
    apt.startTime.startsWith(todayStr)
  );

  return (
    <div className="min-h-full pb-12">
      <Header
        title="Overview"
        subtitle="Global barbershop metrics and today's activity"
        onNewAppointment={() => setNewAptModalOpen(true)}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Metrics */}
        <AdminMetrics
          appointments={appointments}
          barbers={barbers}
          services={services}
          clients={clients}
        />

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setNewAptModalOpen(true)}
            className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  Book Appointment
                </div>
                <div className="text-[10px] text-zinc-400">
                  Live availability
                </div>
              </div>
            </div>
            <Plus className="w-4 h-4 text-amber-400" />
          </button>

          <Link
            href="/admin/barbers"
            className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  Barber Team
                </div>
                <div className="text-[10px] text-zinc-400">
                  {barbers.length} registered
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/services"
            className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  Services & Rates
                </div>
                <div className="text-[10px] text-zinc-400">
                  {services.length} available
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/admin/clients"
            className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  Clients
                </div>
                <div className="text-[10px] text-zinc-400">
                  {clients.length} registered
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Today's Agenda Section */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Today's Schedule ({todayAppointments.length})
              </h3>
              <p className="text-xs text-zinc-400">
                Appointments scheduled for today's shift
              </p>
            </div>
            <Link
              href="/admin/appointments"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              View all appointments
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <AppointmentList
            appointments={todayAppointments.length > 0 ? todayAppointments : appointments.slice(0, 5)}
            isLoading={aptsLoading}
            onUpdateStatus={(apt) => setSelectedAptForStatus(apt)}
            onCancel={(id) => cancelAppointment(id)}
            showBarberCol={true}
          />
        </div>
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={newAptModalOpen}
        onClose={() => setNewAptModalOpen(false)}
        onSuccess={() => {
          refreshApts();
        }}
      />

      <UpdateStatusModal
        appointment={selectedAptForStatus}
        isOpen={!!selectedAptForStatus}
        onClose={() => setSelectedAptForStatus(null)}
        onSuccess={() => {
          refreshApts();
        }}
      />
    </div>
  );
}
