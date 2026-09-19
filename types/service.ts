export interface Service {
  id: number;
  name: string;
  description?: string | null;
  duration: number; // in minutes
  price: number;    // in Colombian Pesos (COP)
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  duration: number;
  price: number;
  active?: boolean;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  active?: boolean;
}
