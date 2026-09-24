'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';
import { Barber } from '@/types/barber';
import { Service } from '@/types/service';
import { Client } from '@/types/client';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  CalendarCheck,
  Users,
  Scissors,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

interface AdminMetricsProps {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
  clients: Client[];
}

export function AdminMetrics({
  appointments,
  barbers,
  services,
  clients,
}: AdminMetricsProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter((apt) =>
    apt.startTime.startsWith(todayStr)
  );

  const completedOrConfirmed = appointments.filter(
    (apt) => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED'
  );

  const totalRevenue = completedOrConfirmed.reduce(
    (sum, apt) => sum + (apt.service?.price || 0),
    0
  );

  const todayRevenue = todayAppointments
    .filter((apt) => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED')
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  const activeBarbers = barbers.filter((b) => b.active).length;

  const totalClosed = appointments.filter(
    (apt) =>
      apt.status === 'COMPLETED' ||
      apt.status === 'CANCELLED' ||
      apt.status === 'NO_SHOW'
  ).length;

  const completedCount = appointments.filter(
    (apt) => apt.status === 'COMPLETED'
  ).length;

  const completionRate =
    totalClosed > 0 ? Math.round((completedCount / totalClosed) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        subtitle={`Today: ${formatCurrency(todayRevenue)}`}
        icon={DollarSign}
        accentColor="amber"
        trend={{ value: '+14%', positive: true }}
      />

      <StatCard
        title="Today's Appointments"
        value={todayAppointments.length}
        subtitle={`${completedOrConfirmed.length} active appointments`}
        icon={CalendarCheck}
        accentColor="emerald"
      />

      <StatCard
        title="Active Barbers"
        value={activeBarbers}
        subtitle={`Of ${barbers.length} on staff`}
        icon={Scissors}
        accentColor="blue"
      />

      <StatCard
        title="Registered Clients"
        value={clients.length}
        subtitle={`${completionRate}% completion rate`}
        icon={Users}
        accentColor="purple"
        trend={{ value: `${completionRate}%`, positive: completionRate >= 80 }}
      />
    </div>
  );
}
