export type UserRole = 'ADMIN' | 'BARBER';

export interface UserSession {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  barberId?: number; // Present if role is BARBER
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: UserSession;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
  barberId?: number;
}
