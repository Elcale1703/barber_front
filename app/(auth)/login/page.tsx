'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { barberApi } from '@/lib/api';
import { Barber } from '@/types/barber';
import {
  Scissors,
  ShieldCheck,
  User,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    barberApi.getAll().then(setBarbers).catch(() => {});
  }, []);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({
        email: 'admin@barberia.com',
        role: 'ADMIN',
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginBarber = async (barberId: number, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      await login({
        email: `barbero${barberId}@barberia.com`,
        role: 'BARBER',
        barberId,
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Card */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 shadow-xl shadow-amber-500/20 mb-3">
            <Scissors className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            BARBERÍA <span className="text-amber-400">PRO</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sistema Integral de Gestión & Panel de Barberos
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Quick 1-Click Access for Demo */}
          <div className="space-y-3 pb-6 border-b border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Acceso Rápido por Rol (JWT)
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
                Demo
              </span>
            </div>

            {/* Admin Quick Login */}
            <button
              onClick={handleQuickLoginAdmin}
              disabled={loading}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    Entrar como Administrador
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Control total de negocio, citas, barberos y servicios
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Barber Quick Login */}
            <button
              onClick={() => handleQuickLoginBarber(1)}
              disabled={loading}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    Entrar como Barbero
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {barbers.length > 0
                      ? `Portal personal de ${barbers[0].name}`
                      : 'Agenda y métricas del barbero'}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Or standard login form */}
          <form onSubmit={handleCustomLogin} className="mt-6 space-y-4">
            <div className="relative">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1.5 font-semibold">
                O iniciar con credenciales
              </span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  placeholder="admin@barberia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold text-xs h-10 rounded-xl shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          Conectado con API NestJS local en <span className="text-zinc-400 font-mono">http://localhost:3000</span>
        </p>
      </div>
    </div>
  );
}
