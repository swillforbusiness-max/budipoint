import { apiClient } from './client';
import type { ApiEnvelope } from '../types/auth.types';
import type {
  SimulatedFundWalletPayload,
  Wallet,
  WalletLedgerEntry,
} from '../types/wallet.types';

export const walletApi = {
  getCustomerWallet: async (): Promise<ApiEnvelope<Wallet>> => {
    const { data } = await apiClient.get<ApiEnvelope<Wallet>>('/customer/wallet');
    return data;
  },

  getWalletLedger: async (): Promise<ApiEnvelope<WalletLedgerEntry[]>> => {
    const { data } = await apiClient.get<ApiEnvelope<WalletLedgerEntry[]>>('/customer/wallet/ledger');
    return data;
  },

  simulateWalletFunding: async (
    payload: SimulatedFundWalletPayload
  ): Promise<ApiEnvelope<{ wallet: Wallet; entry: WalletLedgerEntry }>> => {
    const { data } = await apiClient.post<ApiEnvelope<{ wallet: Wallet; entry: WalletLedgerEntry }>>(
      '/customer/wallet/simulate-fund',
      payload
    );
    return data;
  },
};
