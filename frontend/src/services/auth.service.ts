import { authApi } from '../api/auth.api';
import {
  AUTH_ROLE_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  isMockApiEnabled,
} from '../api/client';
import {
  MOCK_ADMIN_USER,
  MOCK_CUSTOMER_USER,
  MOCK_NOTIFICATIONS,
} from '../mocks/mockData';
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  UserRole,
} from '../types/auth.types';
import type {
  ChangePasswordPayload,
  PlatformNotification,
  UpdateProfilePayload,
  User,
} from '../types/user.types';
import { userApi } from '../api/user.api';

const USER_STORAGE_KEY = 'budipoint_session_user';

function delay(ms = 240): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  getStoredUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      // Provide an active default demo customer session in mock mode if not explicitly logged out
      if (isMockApiEnabled() && localStorage.getItem('budipoint_logged_out') !== 'true') {
        const storedRole = (localStorage.getItem(AUTH_ROLE_STORAGE_KEY) as UserRole) || 'customer';
        const defaultUser = storedRole === 'admin' ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'sim-sanctum-token-budipoint-v1');
        return defaultUser;
      }
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!isMockApiEnabled()) {
      const response = await authApi.login(credentials);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, response.data.user.role);
      localStorage.removeItem('budipoint_logged_out');
      return response.data;
    }

    await delay();
    const isAdminEmail =
      credentials.email.toLowerCase().includes('admin') ||
      credentials.email.toLowerCase() === MOCK_ADMIN_USER.email.toLowerCase();

    const user: User = isAdminEmail
      ? MOCK_ADMIN_USER
      : {
          ...MOCK_CUSTOMER_USER,
          email: credentials.email.trim() || MOCK_CUSTOMER_USER.email,
        };

    const token = `sim-sanctum-${user.role}-token-${Date.now()}`;
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_ROLE_STORAGE_KEY, user.role);
    localStorage.removeItem('budipoint_logged_out');

    return {
      user,
      token,
      isSimulated: true,
    };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (payload.password !== payload.passwordConfirmation) {
      throw new Error('Passwords do not match.');
    }

    if (!isMockApiEnabled()) {
      const response = await authApi.register(payload);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, response.data.user.role);
      localStorage.removeItem('budipoint_logged_out');
      return response.data;
    }

    await delay();
    const newUser: User = {
      id: `usr-cust-${Date.now()}`,
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phoneNumber: payload.phoneNumber.trim(),
      role: 'customer',
      status: 'active',
      emailVerifiedAt: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const token = `sim-sanctum-customer-token-${Date.now()}`;
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(AUTH_ROLE_STORAGE_KEY, 'customer');
    localStorage.removeItem('budipoint_logged_out');

    return {
      user: newUser,
      token,
      isSimulated: true,
    };
  },

  async switchDemoEnvironment(role: UserRole): Promise<User> {
    await delay(120);
    const targetUser = role === 'admin' ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(targetUser));
    localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, `sim-sanctum-${role}-token`);
    localStorage.removeItem('budipoint_logged_out');
    return targetUser;
  },

  async logout(): Promise<void> {
    if (!isMockApiEnabled()) {
      try {
        await authApi.logout();
      } catch {
        // Proceed with local cleanup even if token already expired
      }
    }
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.setItem('budipoint_logged_out', 'true');
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    if (!isMockApiEnabled()) {
      const res = await authApi.forgotPassword(payload);
      return res.message;
    }
    await delay();
    return `[SIMULATED] Password reset instructions queued for ${payload.email}.`;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    if (payload.password !== payload.passwordConfirmation) {
      throw new Error('Password confirmation does not match.');
    }
    if (!isMockApiEnabled()) {
      const res = await authApi.resetPassword(payload);
      return res.message;
    }
    await delay();
    return '[SIMULATED] Password has been updated in sandbox mode.';
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    if (!isMockApiEnabled()) {
      const res = await userApi.updateProfile(payload);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      return res.data;
    }
    await delay();
    const current = this.getStoredUser() ?? MOCK_CUSTOMER_USER;
    const updated: User = {
      ...current,
      fullName: payload.fullName.trim(),
      phoneNumber: payload.phoneNumber.trim(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<string> {
    if (payload.newPassword !== payload.newPasswordConfirmation) {
      throw new Error('New password and confirmation do not match.');
    }
    if (!isMockApiEnabled()) {
      await userApi.changePassword(payload);
      return 'Password updated successfully.';
    }
    await delay();
    return '[SIMULATED] Security credentials updated in sandbox environment.';
  },

  async getNotifications(): Promise<PlatformNotification[]> {
    if (!isMockApiEnabled()) {
      const res = await userApi.getNotifications();
      return res.data;
    }
    await delay(100);
    return MOCK_NOTIFICATIONS;
  },
};
