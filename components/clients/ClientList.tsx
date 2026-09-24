'use client';

import React, { useState } from 'react';
import { Client } from '@/types/client';
import { User, Phone, Mail, Calendar, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export function ClientList({
  clients,
  isLoading,
  onEdit,
  onDelete,
}: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-16 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
            <User className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No clients found</h4>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No results match the search.'
              : 'Add clients to see their appointment history and loyalty.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Appointments</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((client) => {
                  const appointmentCount = client.appointments?.length || 0;

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 font-bold text-xs border border-zinc-700/60">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {client.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              ID #{client.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {client.phone}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {client.email || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {appointmentCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(client)}
                            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            title="Editar cliente"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`¿Eliminar cliente ${client.name}?`)) {
                                onDelete(client.id);
                              }
                            }}
                            className="h-7 w-7 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
