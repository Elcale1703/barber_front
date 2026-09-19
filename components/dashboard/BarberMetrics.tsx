'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react';

interface BarberMetricsProps {
  appointments: Appointment[];
}

export function BarberMetrics({ appointments }: BarberMetricsProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayApts = appointments.filter((apt) =>
    apt.startTime.startsWith(todayStr)
  );

  const completedToday = todayApts.filter(
    (apt) => apt.status === 'COMPLETED'
  ).length;

  const todayEarnings = todayApts
    .filter((apt) => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED')
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  const pendingApts = appointments.filter(
    (apt) => apt.status === 'PENDING' || apt.status === 'CONFIRMED'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Mis Citas Hoy"
        value={todayApts.length}
        subtitle={`${completedToday} ya atendidos`}
        icon={Calendar}
        accentColor="amber"
      />

      <StatCard
        title="Cortes Completados"
        value={completedToday}
        subtitle="Hoy finalizados"
        icon={CheckCircle2}
        accentColor="emerald"
        trend={{ value: `${completedToday}/${todayApts.length}`, positive: true }}
      />

      <StatCard
        title="Ingresos Estimados Hoy"
        value={formatCurrency(todayEarnings)}
        subtitle="En servicios programados"
        icon={DollarSign}
        accentColor="blue"
      />

      <StatCard
        title="Citas por Atender"
        value={pendingApts}
        subtitle="Próximas en agenda"
        icon={Clock}
        accentColor="purple"
      />
    </div>
  );
}
