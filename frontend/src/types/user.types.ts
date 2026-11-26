import type { UserRole } from './auth.types';

export type AccountStatus = 'active' | 'suspended' | 'pending_verification';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: AccountStatus;
  emailVerifiedAt: string | null;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phoneNumber: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface NotificationPreference {
  emailAlerts: boolean;
  smsAlerts: boolean;
  loginAlerts: boolean;
  marketingUpdates: boolean;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'system';
  isRead: boolean;
  createdAt: string;
}
