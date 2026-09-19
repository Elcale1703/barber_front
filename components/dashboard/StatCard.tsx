import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  accentColor?: 'amber' | 'emerald' | 'blue' | 'purple';
}

const accentMap = {
  amber: {
    bg: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    border: 'hover:border-amber-500/30',
  },
  emerald: {
    bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    border: 'hover:border-emerald-500/30',
  },
  blue: {
    bg: 'from-blue-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    border: 'hover:border-blue-500/30',
  },
  purple: {
    bg: 'from-purple-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    border: 'hover:border-purple-500/30',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  accentColor = 'amber',
}: StatCardProps) {
  const accent = accentMap[accentColor];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-black/40',
        accent.border,
        className
      )}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl',
          accent.bg
        )}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-md',
                  trend.positive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl border',
            accent.iconBg
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
