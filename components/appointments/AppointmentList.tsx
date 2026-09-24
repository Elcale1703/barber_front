'use client';

import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { formatCurrency, formatTimeOnly, formatShortDateTime } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Phone,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onUpdateStatus: (appointment: Appointment) => void;
  onCancel: (id: number) => void;
  showBarberCol?: boolean;
}

export function AppointmentList({
  appointments,
  isLoading,
  onUpdateStatus,
  onCancel,
  showBarberCol = true,
}: AppointmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-20 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No appointments found</h4>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
          No appointments match the selected filters. You can book a new one using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt) => {
        const clientName = apt.client?.name || 'Unregistered client';
        const clientPhone = apt.client?.phone || 'No phone';
        const serviceName = apt.service?.name || 'Service';
        const servicePrice = apt.service?.price || 0;
        const duration = apt.service?.duration || 30;
        const barberName = apt.barber?.name || 'Barber Staff';

        return (
          <div
            key={apt.id}
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700/80 transition-all shadow-sm"
          >
            {/* Time & Service Block */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 text-center shrink-0">
                <span className="text-xs font-bold text-amber-400">
                  {formatTimeOnly(apt.startTime)}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {duration} min
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{serviceName}</h4>
                  <span className="text-xs font-semibold text-amber-400/90">
                    {formatCurrency(servicePrice)}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    {clientName}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Phone className="w-3 h-3 text-zinc-400" />
                    {clientPhone}
                  </span>
                  {showBarberCol && (
                    <span className="flex items-center gap-1 text-amber-300/80">
                      <Scissors className="w-3 h-3 text-amber-400" />
                      {barberName}
                    </span>
                  )}
                </div>

                {apt.notes && (
                  <p className="mt-1 text-[11px] text-zinc-400 italic">
                    "{apt.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
              <AppointmentStatusBadge status={apt.status} />

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(apt)}
                  className="h-8 text-xs border-zinc-800 hover:bg-zinc-800 hover:text-white"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Status
                </Button>

                {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this appointment?')) {
                        onCancel(apt.id);
                      }
                    }}
                    className="h-8 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Cancel Appointment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
