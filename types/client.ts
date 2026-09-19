import { Appointment } from './appointment';

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  createdAt: string;
  updatedAt: string;

  appointments?: Appointment[];
}

export interface CreateClientPayload {
  name: string;
  phone: string;
  email?: string;
}

export interface UpdateClientPayload {
  name?: string;
  phone?: string;
  email?: string;
}
