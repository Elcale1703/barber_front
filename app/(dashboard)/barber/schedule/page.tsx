'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { barberApi } from '@/lib/api';
import { Barber } from '@/types/barber';
import {
  DAYS_OF_WEEK,
  formatMinutesToTime,
  formatCurrency,
} from '@/lib/utils';
import { Clock, Sparkles, Scissors, Calendar, CheckCircle2 } from 'lucide-react';

export default function BarberScheduleViewerPage() {
  const { user } = useAuth();
  const barberId = user?.barberId || 1;

  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    barberApi
      .getById(barberId)
      .then(setBarber)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [barberId]);

  const schedules = barber?.schedules || [];
  const assignedServices = barber?.services || [];

  // Order days from Monday (1) to Sunday (0)
  const daysOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="min-h-full pb-12">
      <Header
        title="My Schedule & Specialties"
        subtitle={`Weekly work schedule and assigned services catalog for ${user?.name || 'your profile'}`}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Work Schedule Timetable */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  My Weekly Work Schedule
                </h3>
                <p className="text-xs text-zinc-400">
                  Days and shifts when the system accepts automatic bookings
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-12 rounded-xl bg-zinc-900/40 animate-pulse"
                  />
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
                You don't have any schedules assigned by administration yet.
              </div>
            ) : (
              <div className="space-y-2">
                {daysOrder.map((dayNum) => {
                  const schedule = schedules.find((s) => s.dayOfWeek === dayNum);
                  const dayName = DAYS_OF_WEEK[dayNum];

                  return (
                    <div
                      key={dayNum}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        schedule
                          ? 'border-zinc-800 bg-zinc-900/60'
                          : 'border-zinc-900 bg-zinc-950/40 opacity-50'
                      }`}
                    >
                      <span className="text-xs font-bold text-zinc-200">
                        {dayName}
                      </span>

                      {schedule ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-xs font-semibold text-amber-300 border border-zinc-700">
                            {formatMinutesToTime(schedule.startMinute)}
                          </span>
                          <span className="text-zinc-500 text-xs">to</span>
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-xs font-semibold text-amber-300 border border-zinc-700">
                            {formatMinutesToTime(schedule.endMinute)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">
                          Day off
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assigned Services */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Services I Perform ({assignedServices.length})
                </h3>
                <p className="text-xs text-zinc-400">
                  Haircuts, trims and treatments authorized for your profile
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-16 rounded-xl bg-zinc-900/40 animate-pulse"
                  />
                ))}
              </div>
            ) : assignedServices.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
                You don't have any services assigned yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {assignedServices.map((bs) => {
                  const service = bs.service;
                  if (!service) return null;

                  return (
                    <div
                      key={bs.id || service.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-amber-400">
                          <Scissors className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {service.name}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {service.duration} min duration
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-amber-400">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
