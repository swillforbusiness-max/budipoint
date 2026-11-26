import { apiClient } from './client';
import type {
  ApiEnvelope,
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types/auth.types';
import type { User } from '../types/user.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiEnvelope<AuthResponse>> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/login', credentials);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<ApiEnvelope<AuthResponse>> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/register', payload);
    return data;
  },

  logout: async (): Promise<ApiEnvelope<{ loggedOut: boolean }>> => {
    const { data } = await apiClient.post<ApiEnvelope<{ loggedOut: boolean }>>('/auth/logout');
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiEnvelope<{ sent: boolean }>> => {
    const { data } = await apiClient.post<ApiEnvelope<{ sent: boolean }>>('/auth/forgot-password', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiEnvelope<{ reset: boolean }>> => {
    const { data } = await apiClient.post<ApiEnvelope<{ reset: boolean }>>('/auth/reset-password', payload);
    return data;
  },

  me: async (): Promise<ApiEnvelope<User>> => {
    const { data } = await apiClient.get<ApiEnvelope<User>>('/auth/me');
    return data;
  },
};
