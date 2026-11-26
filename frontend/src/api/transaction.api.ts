import { apiClient } from './client';
import type { ApiEnvelope } from '../types/auth.types';
import type {
  CustomerDashboardMetrics,
  TransactionFilterParams,
  TransactionRecord,
} from '../types/transaction.types';

export const transactionApi = {
  getCustomerMetrics: async (): Promise<ApiEnvelope<CustomerDashboardMetrics>> => {
    const { data } = await apiClient.get<ApiEnvelope<CustomerDashboardMetrics>>('/customer/dashboard-metrics');
    return data;
  },

  getCustomerTransactions: async (
    params?: TransactionFilterParams
  ): Promise<ApiEnvelope<TransactionRecord[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionRecord[]>>('/customer/transactions', {
      params,
    });
    return data;
  },

  getTransactionByReference: async (reference: string): Promise<ApiEnvelope<TransactionRecord>> => {
    const { data } = await apiClient.get<ApiEnvelope<TransactionRecord>>(
      `/customer/transactions/${encodeURIComponent(reference)}`
    );
    return data;
  },
};
