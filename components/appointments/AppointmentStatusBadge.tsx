import React from 'react';
import { AppointmentStatus } from '@/types/appointment';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, CheckCheck, XCircle, UserX } from 'lucide-react';

interface StatusConfig {
  label: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusConfigs: Record<AppointmentStatus, StatusConfig> = {
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Clock,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: CheckCheck,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    icon: XCircle,
  },
  NO_SHOW: {
    label: 'No Show',
    className: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    icon: UserX,
  },
};

export function AppointmentStatusBadge({
  status,
  className,
  showIcon = true,
}: {
  status: AppointmentStatus;
  className?: string;
  showIcon?: boolean;
}) {
  const config = statusConfigs[status] || {
    label: status,
    className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-xs transition-all',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
