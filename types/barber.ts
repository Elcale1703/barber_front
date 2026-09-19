import { Service } from './service';

export interface BarberSchedule {
  id?: number;
  barberId?: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  startMinute: number; // e.g. 480 (08:00 AM)
  endMinute: number;   // e.g. 1080 (06:00 PM)
}

export interface BarberServiceRel {
  id?: number;
  barberId: number;
  serviceId: number;
  service?: Service;
}

export interface Barber {
  id: number;
  name: string;
  phone?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  schedules?: BarberSchedule[];
  services?: BarberServiceRel[];
}

export interface CreateBarberPayload {
  name: string;
  phone?: string;
  active?: boolean;
}

export interface UpdateBarberPayload {
  name?: string;
  phone?: string;
  active?: boolean;
}

export interface AssignServicesPayload {
  serviceIds: number[];
}

export interface SetSchedulesPayload {
  schedules: {
    dayOfWeek: number;
    startMinute: number;
    endMinute: number;
  }[];
}
