import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterPayload, UserRole } from '../types/auth.types';
import type { UpdateProfilePayload, User } from '../types/user.types';

const AUTH_CHANGE_EVENT = 'budipoint:auth-changed';

function broadcastAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setUser(authService.getStoredUser());
    };
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      broadcastAuthChange();
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      setUser(response.user);
      broadcastAuthChange();
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to complete registration.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      broadcastAuthChange();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchEnvironmentRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    try {
      const nextUser = await authService.switchDemoEnvironment(role);
      setUser(nextUser);
      broadcastAuthChange();
      return nextUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authService.updateProfile(payload);
      setUser(updated);
      broadcastAuthChange();
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    isLoading,
    error,
    login,
    register,
    logout,
    switchEnvironmentRole,
    updateProfile,
  };
}
