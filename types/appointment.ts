import { Barber } from './barber';
import { Client } from './client';
import { Service } from './service';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  id: number;
  clientId: number;
  barberId: number;
  serviceId: number;
  startTime: string; // ISO String (UTC)
  endTime: string;   // ISO String (UTC)
  status: AppointmentStatus;
  notes?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt: string;

  // Joined relations from backend
  client?: Client;
  barber?: Barber;
  service?: Service;
}

export interface CreateAppointmentPayload {
  barberId: number;
  serviceId: number;
  startTime: string;
  clientId?: number;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  status?: AppointmentStatus;
  notes?: string;
  source?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
  notes?: string;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse {
  date: string;
  barberId?: number;
  serviceId?: number;
  slots?: AvailabilitySlot[];
  availableSlots?: AvailabilitySlot[];
  isWorkingDay?: boolean;
  totalSlotsAvailable?: number;
}
