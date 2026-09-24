'use client';

import React, { useState, useEffect } from 'react';
import { appointmentApi } from '@/lib/api';
import { AvailabilitySlot } from '@/types/appointment';
import { formatTimeOnly } from '@/lib/utils';
import { Clock, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvailabilitySlotsProps {
  barberId?: number;
  serviceId?: number;
  date?: string; // YYYY-MM-DD
  selectedSlot?: string | null; // ISO string
  onSelectSlot: (slotIso: string) => void;
}

export function AvailabilitySlots({
  barberId,
  serviceId,
  date,
  selectedSlot,
  onSelectSlot,
}: AvailabilitySlotsProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barberId || !serviceId || !date) {
      setSlots([]);
      return;
    }

    let isMounted = true;
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await appointmentApi.getAvailability({
          barberId,
          serviceId,
          date,
        });
        if (isMounted) {
          const slotsList = (res as any).availableSlots || res.slots || [];
          setSlots(slotsList);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch availability');
          setSlots([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [barberId, serviceId, date]);

  if (!barberId || !serviceId || !date) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-400">
        Select a barber, service and date to calculate available slots.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-xs text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
        <span>Checking barber schedule and appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center text-xs text-zinc-400">
        No available slots for this barber on the selected date, or no schedule configured for this day.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 font-medium text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Available Slots ({slots.length})
        </span>
        <span className="text-[11px] text-zinc-400">Select a time slot</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
        {slots.map((slot, index) => {
          const isSelected = selectedSlot === slot.startTime;
          const timeLabel = formatTimeOnly(slot.startTime);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectSlot(slot.startTime)}
              className={cn(
                'px-2.5 py-2 rounded-xl text-xs font-semibold transition-all border text-center flex flex-col items-center justify-center',
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800'
              )}
            >
              <span>{timeLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
