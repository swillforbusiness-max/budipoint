import { adminApi } from '../api/admin.api';
import { isMockApiEnabled } from '../api/client';
import { walletApi } from '../api/wallet.api';
import { MOCK_CUSTOMER_WALLET, MOCK_WALLET_LEDGER } from '../mocks/mockData';
import type {
  ManualWalletAdjustmentPayload,
  SimulatedFundWalletPayload,
  Wallet,
  WalletLedgerEntry,
} from '../types/wallet.types';

let inMemoryWallet: Wallet = { ...MOCK_CUSTOMER_WALLET };
let inMemoryLedger: WalletLedgerEntry[] = [...MOCK_WALLET_LEDGER];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const walletService = {
  async getWallet(): Promise<Wallet> {
    if (!isMockApiEnabled()) {
      const response = await walletApi.getCustomerWallet();
      return response.data;
    }
    await delay(120);
    return { ...inMemoryWallet };
  },

  async getLedger(): Promise<WalletLedgerEntry[]> {
    if (!isMockApiEnabled()) {
      const response = await walletApi.getWalletLedger();
      return response.data;
    }
    await delay(120);
    return [...inMemoryLedger];
  },

  async simulateFunding(
    payload: SimulatedFundWalletPayload
  ): Promise<{ wallet: Wallet; entry: WalletLedgerEntry }> {
    const parsedAmount = parseFloat(payload.amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 100) {
      throw new Error('Minimum simulated funding amount is NGN 100.00.');
    }

    if (!isMockApiEnabled()) {
      const response = await walletApi.simulateWalletFunding(payload);
      return response.data;
    }

    await delay(280);
    const before = parseFloat(inMemoryWallet.availableBalance);
    const after = before + parsedAmount;

    const newEntry: WalletLedgerEntry = {
      id: `wle-${Date.now()}`,
      reference: `BDP-WLT-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
      walletId: inMemoryWallet.id,
      userName: 'Adebayo Ogunlesi',
      userEmail: 'adebayo.ogunlesi@budipoint.ng',
      type: 'credit',
      channel: payload.channel,
      amount: parsedAmount.toFixed(2),
      balanceBefore: before.toFixed(2),
      balanceAfter: after.toFixed(2),
      status: 'successful',
      narration: `[SIMULATED] Sandbox Wallet Credit via ${
        payload.channel === 'bank_transfer' ? 'Virtual Bank Transfer' : 'Card Simulation'
      }`,
      createdAt: new Date().toISOString(),
      isSimulated: true,
    };

    inMemoryWallet = {
      ...inMemoryWallet,
      availableBalance: after.toFixed(2),
      ledgerBalance: (parseFloat(inMemoryWallet.ledgerBalance) + parsedAmount).toFixed(2),
      updatedAt: new Date().toISOString(),
    };
    inMemoryLedger = [newEntry, ...inMemoryLedger];

    return {
      wallet: { ...inMemoryWallet },
      entry: newEntry,
    };
  },

  async submitManualAdminAdjustment(
    payload: ManualWalletAdjustmentPayload
  ): Promise<WalletLedgerEntry> {
    const parsedAmount = parseFloat(payload.amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error('Adjustment amount must be greater than zero.');
    }
    if (!payload.reason.trim() || payload.reason.trim().length < 10) {
      throw new Error('An audit reason of at least 10 characters is mandatory for manual wallet adjustments.');
    }
    if (!payload.authorizationCode.trim()) {
      throw new Error('Supervisor authorization code is required.');
    }

    if (!isMockApiEnabled()) {
      const response = await adminApi.submitManualWalletAdjustment(payload);
      return response.data;
    }

    await delay(280);
    const before = parseFloat(inMemoryWallet.availableBalance);
    const after = payload.type === 'credit' ? before + parsedAmount : Math.max(0, before - parsedAmount);

    const adjustmentEntry: WalletLedgerEntry = {
      id: `wle-adj-${Date.now()}`,
      reference: `BDP-ADJ-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
      walletId: payload.walletId,
      userName: 'Adebayo Ogunlesi',
      userEmail: 'adebayo.ogunlesi@budipoint.ng',
      type: payload.type,
      channel: 'manual_adjustment',
      amount: parsedAmount.toFixed(2),
      balanceBefore: before.toFixed(2),
      balanceAfter: after.toFixed(2),
      status: 'successful',
      narration: `[SIMULATED AUDIT ADJUSTMENT] ${payload.reason.trim()} (Auth: ${payload.authorizationCode.trim()})`,
      createdAt: new Date().toISOString(),
      isSimulated: true,
    };

    inMemoryWallet = {
      ...inMemoryWallet,
      availableBalance: after.toFixed(2),
      ledgerBalance: after.toFixed(2),
      updatedAt: new Date().toISOString(),
    };
    inMemoryLedger = [adjustmentEntry, ...inMemoryLedger];

    return adjustmentEntry;
  },
};
