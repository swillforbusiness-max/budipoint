import { adminApi } from '../api/admin.api';
import { isMockApiEnabled } from '../api/client';
import { servicesApi } from '../api/services.api';
import { transactionApi } from '../api/transaction.api';
import {
  MOCK_ADMIN_METRICS,
  MOCK_AUDIT_LOGS,
  MOCK_CUSTOMER_METRICS,
  MOCK_PLATFORM_SERVICES,
  MOCK_REGISTERED_USERS,
  MOCK_TRANSACTIONS,
} from '../mocks/mockData';
import type { PlatformServiceCategory, ServiceSlug } from '../types/service.types';
import type {
  AdminDashboardMetrics,
  AuditLogRecord,
  CustomerDashboardMetrics,
  TransactionFilterParams,
  TransactionRecord,
} from '../types/transaction.types';
import type { AccountStatus, User } from '../types/user.types';

let inMemoryServices: PlatformServiceCategory[] = [...MOCK_PLATFORM_SERVICES];
let inMemoryUsers: User[] = [...MOCK_REGISTERED_USERS];
let inMemoryAuditLogs: AuditLogRecord[] = [...MOCK_AUDIT_LOGS];

function delay(ms = 160): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const transactionService = {
  async getCustomerMetrics(): Promise<CustomerDashboardMetrics> {
    if (!isMockApiEnabled()) {
      const response = await transactionApi.getCustomerMetrics();
      return response.data;
    }
    await delay(100);
    return { ...MOCK_CUSTOMER_METRICS };
  },

  async getTransactions(filters?: TransactionFilterParams): Promise<TransactionRecord[]> {
    if (!isMockApiEnabled()) {
      const response = await transactionApi.getCustomerTransactions(filters);
      return response.data;
    }
    await delay(130);
    return this.filterLocalTransactions(MOCK_TRANSACTIONS, filters);
  },

  async getAdminMetrics(): Promise<AdminDashboardMetrics> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.getDashboardMetrics();
      return response.data;
    }
    await delay(120);
    return { ...MOCK_ADMIN_METRICS };
  },

  async getAdminTransactions(filters?: TransactionFilterParams): Promise<TransactionRecord[]> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.listAllTransactions(filters);
      return response.data;
    }
    await delay(130);
    return this.filterLocalTransactions(MOCK_TRANSACTIONS, filters);
  },

  filterLocalTransactions(
    records: TransactionRecord[],
    filters?: TransactionFilterParams
  ): TransactionRecord[] {
    if (!filters) return [...records];

    return records.filter((item) => {
      if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      if (filters.serviceSlug && filters.serviceSlug !== 'all' && item.serviceSlug !== filters.serviceSlug) {
        return false;
      }
      if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase();
        const matches =
          item.reference.toLowerCase().includes(q) ||
          item.serviceName.toLowerCase().includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.recipient && item.recipient.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (filters.dateFrom) {
        const itemDate = new Date(item.createdAt).getTime();
        const fromDate = new Date(filters.dateFrom).getTime();
        if (itemDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const itemDate = new Date(item.createdAt).getTime();
        const toDate = new Date(filters.dateTo).getTime() + 86400000;
        if (itemDate > toDate) return false;
      }
      return true;
    });
  },

  async listPlatformServices(): Promise<PlatformServiceCategory[]> {
    if (!isMockApiEnabled()) {
      const response = await servicesApi.listServices();
      return response.data;
    }
    await delay(100);
    return [...inMemoryServices];
  },

  async getServiceBySlug(slug: ServiceSlug): Promise<PlatformServiceCategory | undefined> {
    if (!isMockApiEnabled()) {
      const response = await servicesApi.getServiceBySlug(slug);
      return response.data;
    }
    await delay(80);
    return inMemoryServices.find((s) => s.slug === slug);
  },

  async updatePlatformService(
    serviceId: string,
    updates: Partial<PlatformServiceCategory>
  ): Promise<PlatformServiceCategory> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.updateServiceCategory(serviceId, updates);
      return response.data;
    }
    await delay(180);
    const idx = inMemoryServices.findIndex((s) => s.id === serviceId);
    if (idx === -1) {
      throw new Error('Service category not found.');
    }
    const updated: PlatformServiceCategory = {
      ...inMemoryServices[idx],
      ...updates,
    };
    inMemoryServices[idx] = updated;
    return updated;
  },

  async listRegisteredUsers(search?: string, statusFilter?: string): Promise<User[]> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.listUsers({ search, status: statusFilter });
      return response.data;
    }
    await delay(120);
    return inMemoryUsers.filter((u) => {
      if (statusFilter && statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        return (
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phoneNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async updateUserAccountStatus(userId: string, status: AccountStatus, reason: string): Promise<User> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.updateUserStatus(userId, status);
      return response.data;
    }
    await delay(180);
    const idx = inMemoryUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Customer record not found.');
    const updated: User = { ...inMemoryUsers[idx], status };
    inMemoryUsers[idx] = updated;

    inMemoryAuditLogs = [
      {
        id: `aud-${Date.now()}`,
        actorName: 'Chidinma Nwosu',
        actorRole: 'admin',
        action: status === 'suspended' ? 'ACCOUNT_SUSPENDED' : 'ACCOUNT_ACTIVATED',
        entityType: 'User',
        entityId: `${updated.id} (${updated.fullName})`,
        reason: reason || `Account status transitioned to ${status}`,
        ipAddress: '127.0.0.1',
        createdAt: new Date().toISOString(),
      },
      ...inMemoryAuditLogs,
    ];

    return updated;
  },

  async listAuditLogs(): Promise<AuditLogRecord[]> {
    if (!isMockApiEnabled()) {
      const response = await adminApi.listAuditLogs();
      return response.data;
    }
    await delay(100);
    return [...inMemoryAuditLogs];
  },
};
