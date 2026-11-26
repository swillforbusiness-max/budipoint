import type { User } from './user.types';

export type UserRole = 'customer' | 'admin';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  isSimulated: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    isSimulated: boolean;
    timestamp: string;
    pagination?: {
      currentPage: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
}
