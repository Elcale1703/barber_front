'use client';

import React, { useState, useEffect } from 'react';
import { Barber, BarberSchedule } from '@/types/barber';
import { barberApi } from '@/lib/api';
import {
  DAYS_OF_WEEK,
  formatMinutesToTime,
  parseTimeToMinutes,
} from '@/lib/utils';
import { X, Clock, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarberScheduleModalProps {
  barber: Barber | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DayScheduleRow {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string; // "08:00"
  endTime: string;   // "18:00"
}

export function BarberScheduleModal({
  barber,
  isOpen,
  onClose,
  onSuccess,
}: BarberScheduleModalProps) {
  // Days 0 (Domingo) to 6 (Sábado) or ordered 1 (Lunes) to 0 (Domingo)
  const [rows, setRows] = useState<DayScheduleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && barber) {
      const existing = barber.schedules || [];

      // Build 7 days (Lunes 1 to Domingo 0)
      const dayOrder = [1, 2, 3, 4, 5, 6, 0];
      const initialRows: DayScheduleRow[] = dayOrder.map((dayNum) => {
        const found = existing.find((s) => s.dayOfWeek === dayNum);
        if (found) {
          return {
            dayOfWeek: dayNum,
            enabled: true,
            startTime: formatMinutesToTime(found.startMinute, true),
            endTime: formatMinutesToTime(found.endMinute, true),
          };
        }
        return {
          dayOfWeek: dayNum,
          enabled: dayNum !== 0, // Domingo off by default
          startTime: '08:00',
          endTime: '18:00',
        };
      });

      setRows(initialRows);
      setError(null);
    }
  }, [isOpen, barber]);

  if (!isOpen || !barber) return null;

  const updateRow = (index: number, updates: Partial<DayScheduleRow>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...updates } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate that end time > start time for all enabled days
    for (const r of rows) {
      if (r.enabled) {
        const start = parseTimeToMinutes(r.startTime);
        const end = parseTimeToMinutes(r.endTime);
        if (end <= start) {
          setError(
            `El horario de fin debe ser posterior al de inicio para el día ${DAYS_OF_WEEK[r.dayOfWeek]}`
          );
          setLoading(false);
          return;
        }
      }
    }

    const schedules = rows
      .filter((r) => r.enabled)
      .map((r) => ({
        dayOfWeek: r.dayOfWeek,
        startMinute: parseTimeToMinutes(r.startTime),
        endMinute: parseTimeToMinutes(r.endTime),
      }));

    try {
      await barberApi.setSchedules(barber.id, { schedules });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar los horarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Horarios Semanales</h3>
              <p className="text-xs text-zinc-400">
                Configura los días y turnos de trabajo para {barber.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-2">
            {rows.map((row, index) => {
              const dayName = DAYS_OF_WEEK[row.dayOfWeek];

              return (
                <div
                  key={row.dayOfWeek}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    row.enabled
                      ? 'border-zinc-800 bg-zinc-900/60'
                      : 'border-zinc-900 bg-zinc-950/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-36">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) =>
                        updateRow(index, { enabled: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-200">
                      {dayName}
                    </span>
                  </div>

                  {row.enabled ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-400">Desde</span>
                        <input
                          type="time"
                          value={row.startTime}
                          onChange={(e) =>
                            updateRow(index, { startTime: e.target.value })
                          }
                          className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                          required
                        />
                      </div>
                      <span className="text-zinc-500">-</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-400">Hasta</span>
                        <input
                          type="time"
                          value={row.endTime}
                          onChange={(e) =>
                            updateRow(index, { endTime: e.target.value })
                          }
                          className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">
                      Día libre / No laborable
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs border-zinc-800 hover:bg-zinc-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold text-xs gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Horarios</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
