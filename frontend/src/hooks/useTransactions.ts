import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '../services/transaction.service';
import type { PlatformServiceCategory } from '../types/service.types';
import type {
  AdminDashboardMetrics,
  CustomerDashboardMetrics,
  TransactionFilterParams,
  TransactionRecord,
} from '../types/transaction.types';

export function useTransactions(initialFilters?: TransactionFilterParams) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [customerMetrics, setCustomerMetrics] = useState<CustomerDashboardMetrics | null>(null);
  const [adminMetrics, setAdminMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [services, setServices] = useState<PlatformServiceCategory[]>([]);
  const [filters, setFilters] = useState<TransactionFilterParams>(
    initialFilters ?? { status: 'all', serviceSlug: 'all', search: '' }
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (activeFilters?: TransactionFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const [trxList, custMetrics, admMetrics, serviceCatalog] = await Promise.all([
        transactionService.getTransactions(activeFilters),
        transactionService.getCustomerMetrics(),
        transactionService.getAdminMetrics(),
        transactionService.listPlatformServices(),
      ]);
      setTransactions(trxList);
      setCustomerMetrics(custMetrics);
      setAdminMetrics(admMetrics);
      setServices(serviceCatalog);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transaction data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData(filters);
  }, [filters, loadData]);

  const updateFilters = useCallback((next: Partial<TransactionFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const updateServiceConfiguration = useCallback(
    async (serviceId: string, updates: Partial<PlatformServiceCategory>) => {
      const updated = await transactionService.updatePlatformService(serviceId, updates);
      setServices((prev) => prev.map((s) => (s.id === serviceId ? updated : s)));
      return updated;
    },
    []
  );

  return {
    transactions,
    customerMetrics,
    adminMetrics,
    services,
    filters,
    isLoading,
    error,
    updateFilters,
    refreshTransactions: () => loadData(filters),
    updateServiceConfiguration,
  };
}
