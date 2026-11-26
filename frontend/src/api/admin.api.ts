import { apiClient } from './client';
import type { ApiEnvelope } from '../types/auth.types';
import type { AccountStatus, User } from '../types/user.types';
import type {
  AdminDashboardMetrics,
  AuditLogRecord,
  TransactionFilterParams,
  TransactionRecord,
} from '../types/transaction.types';
import type { PlatformServiceCategory } from '../types/service.types';
import type { ManualWalletAdjustmentPayload, WalletLedgerEntry } from '../types/wallet.types';

export const adminApi = {
  getDashboardMetrics: async (): Promise<ApiEnvelope<AdminDashboardMetrics>> => {
    const { data } = await apiClient.get<ApiEnvelope<AdminDashboardMetrics>>('/admin/dashboard');
    return data;
  },

  listUsers: async (params?: { search?: string; status?: string }): Promise<ApiEnvelope<User[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<User[]>>('/admin/users', { params });
    return data;
  },

  updateUserStatus: async (userId: string, status: AccountStatus): Promise<ApiEnvelope<User>> => {
    const { data } = await apiClient.patch<ApiEnvelope<User>>(`/admin/users/${userId}/status`, { status });
    return data;
  },

  listAllTransactions: async (
    params?: TransactionFilterParams
  ): Promise<ApiEnvelope<TransactionRecord[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionRecord[]>>('/admin/transactions', { params });
    return data;
  },

  updateServiceCategory: async (
    serviceId: string,
    payload: Partial<PlatformServiceCategory>
  ): Promise<ApiEnvelope<PlatformServiceCategory>> => {
    const { data } = await apiClient.patch<ApiEnvelope<PlatformServiceCategory>>(
      `/admin/services/${serviceId}`,
      payload
    );
    return data;
  },

  listWalletLedgers: async (): Promise<ApiEnvelope<WalletLedgerEntry[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<WalletLedgerEntry[]>>('/admin/wallets/ledgers');
    return data;
  },

  submitManualWalletAdjustment: async (
    payload: ManualWalletAdjustmentPayload
  ): Promise<ApiEnvelope<WalletLedgerEntry>> => {
    const { data } = await apiClient.post<ApiEnvelope<WalletLedgerEntry>>(
      '/admin/wallets/manual-adjustment',
      payload
    );
    return data;
  },

  listAuditLogs: async (): Promise<ApiEnvelope<AuditLogRecord[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<AuditLogRecord[]>>('/admin/audit-logs');
    return data;
  },
};
