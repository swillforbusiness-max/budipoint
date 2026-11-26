import type { ServiceSlug } from './service.types';

export type TransactionStatus = 'successful' | 'pending' | 'failed';
export type TransactionEntryType = 'credit' | 'debit';

export interface TransactionRecord {
  id: string;
  reference: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  serviceSlug: ServiceSlug | 'wallet-funding';
  serviceName: string;
  type: TransactionEntryType;
  amount: string;
  fee: string;
  status: TransactionStatus;
  recipient?: string;
  description: string;
  providerReference?: string;
  createdAt: string;
  isSimulated: boolean;
}

export interface TransactionFilterParams {
  search?: string;
  status?: TransactionStatus | 'all';
  serviceSlug?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}

export interface CustomerDashboardMetrics {
  walletBalance: string;
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalSpentThisMonth: string;
  isSimulated: boolean;
}

export interface AdminDashboardMetrics {
  totalRegisteredUsers: number;
  activeUsers: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalTransactionVolume: string;
  walletFundingVolume: string;
  revenueOverview: string;
  transactionSeries: Array<{ label: string; successful: number; pending: number; failed: number }>;
  revenueSeries: Array<{ label: string; volumeNgn: number; revenueNgn: number }>;
  servicePerformance: Array<{ serviceName: string; count: number; volumeNgn: string; sharePercent: number }>;
  isSimulated: boolean;
}

export interface AuditLogRecord {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  reason: string;
  ipAddress: string;
  createdAt: string;
}
