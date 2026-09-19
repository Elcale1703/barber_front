import { getStoredToken } from './auth';
import {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentStatusPayload,
  AvailabilityResponse,
} from '@/types/appointment';
import {
  Barber,
  CreateBarberPayload,
  UpdateBarberPayload,
  SetSchedulesPayload,
} from '@/types/barber';
import {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from '@/types/service';
import {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from '@/types/client';

// Direct backend URL, guaranteed without trailing slash
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://barberia-demo-gilt.vercel.app'
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  // Only set Content-Type on methods that carry a body
  if (['POST', 'PUT', 'PATCH'].includes(method) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach token if present
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorBody: any;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = { message: res.statusText };
      }
      const message = Array.isArray(errorBody?.message)
        ? errorBody.message.join(', ')
        : errorBody?.message || `Error del servidor (${res.status})`;
      throw new ApiError(res.status, message, errorBody);
    }

    if (res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      0,
      `No se pudo conectar con el servidor en ${API_BASE_URL}. (${err.message || 'Error de red'})`
    );
  }
}

// ----------------------------------------------------
// Appointments Controller Endpoints (/appointments)
// ----------------------------------------------------
export const appointmentApi = {
  getAll: (params?: {
    barberId?: number;
    clientId?: number;
    status?: string;
    from?: string;
    to?: string;
  }): Promise<Appointment[]> => {
    const query = new URLSearchParams();
    if (params?.barberId) query.set('barberId', params.barberId.toString());
    if (params?.clientId) query.set('clientId', params.clientId.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);

    const qs = query.toString();
    return request(`/appointments${qs ? `?${qs}` : ''}`);
  },

  getById: (id: number): Promise<Appointment> => {
    return request(`/appointments/${id}`);
  },

  getAvailability: (params: {
    barberId: number;
    serviceId: number;
    date: string;
    stepMinutes?: number;
  }): Promise<AvailabilityResponse> => {
    const query = new URLSearchParams({
      barberId: params.barberId.toString(),
      serviceId: params.serviceId.toString(),
      date: params.date,
    });
    if (params.stepMinutes) {
      query.set('stepMinutes', params.stepMinutes.toString());
    }
    return request(`/appointments/availability?${query.toString()}`);
  },

  create: (payload: CreateAppointmentPayload): Promise<Appointment> => {
    return request('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateStatus: (
    id: number,
    payload: UpdateAppointmentStatusPayload
  ): Promise<Appointment> => {
    return request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  cancel: (id: number, reason?: string): Promise<Appointment> => {
    const qs = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return request(`/appointments/${id}${qs}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// Barbers Controller Endpoints (/barbers)
// ----------------------------------------------------
export const barberApi = {
  getAll: (activeOnly: boolean = false): Promise<Barber[]> => {
    const qs = activeOnly ? '?active=true' : '';
    return request(`/barbers${qs}`);
  },

  getById: (id: number): Promise<Barber> => {
    return request(`/barbers/${id}`);
  },

  create: (payload: CreateBarberPayload): Promise<Barber> => {
    return request('/barbers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: (id: number, payload: UpdateBarberPayload): Promise<Barber> => {
    return request(`/barbers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  assignServices: (id: number, serviceIds: number[]): Promise<any> => {
    return request(`/barbers/${id}/services`, {
      method: 'PUT',
      body: JSON.stringify({ serviceIds }),
    });
  },

  setSchedules: (id: number, payload: SetSchedulesPayload): Promise<any> => {
    return request(`/barbers/${id}/schedules`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: (id: number): Promise<any> => {
    return request(`/barbers/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// Services Controller Endpoints (/services)
// ----------------------------------------------------
export const serviceApi = {
  getAll: (activeOnly: boolean = false): Promise<Service[]> => {
    const qs = activeOnly ? '?active=true' : '';
    return request(`/services${qs}`);
  },

  getById: (id: number): Promise<Service> => {
    return request(`/services/${id}`);
  },

  create: (payload: CreateServicePayload): Promise<Service> => {
    return request('/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: (id: number, payload: UpdateServicePayload): Promise<Service> => {
    return request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: (id: number): Promise<any> => {
    return request(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// Clients Controller Endpoints (/clients)
// ----------------------------------------------------
export const clientApi = {
  getAll: (): Promise<Client[]> => {
    return request('/clients');
  },

  getById: (id: number): Promise<Client> => {
    return request(`/clients/${id}`);
  },

  getByPhone: (phone: string): Promise<Client> => {
    return request(`/clients/by-phone/${encodeURIComponent(phone)}`);
  },

  create: (payload: CreateClientPayload): Promise<Client> => {
    return request('/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update: (id: number, payload: UpdateClientPayload): Promise<Client> => {
    return request(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  delete: (id: number): Promise<any> => {
    return request(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};
