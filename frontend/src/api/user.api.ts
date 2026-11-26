import { apiClient } from './client';
import type { ApiEnvelope } from '../types/auth.types';
import type {
  ChangePasswordPayload,
  NotificationPreference,
  PlatformNotification,
  UpdateProfilePayload,
  User,
} from '../types/user.types';

export const userApi = {
  getProfile: async (): Promise<ApiEnvelope<User>> => {
    const { data } = await apiClient.get<ApiEnvelope<User>>('/customer/profile');
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<ApiEnvelope<User>> => {
    const { data } = await apiClient.put<ApiEnvelope<User>>('/customer/profile', payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiEnvelope<{ updated: boolean }>> => {
    const { data } = await apiClient.put<ApiEnvelope<{ updated: boolean }>>('/customer/profile/password', payload);
    return data;
  },

  getNotifications: async (): Promise<ApiEnvelope<PlatformNotification[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<PlatformNotification[]>>('/customer/notifications');
    return data;
  },

  updateNotificationPreferences: async (
    prefs: NotificationPreference
  ): Promise<ApiEnvelope<NotificationPreference>> => {
    const { data } = await apiClient.put<ApiEnvelope<NotificationPreference>>(
      '/customer/profile/notification-preferences',
      prefs
    );
    return data;
  },
};
