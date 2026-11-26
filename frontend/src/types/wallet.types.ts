export type WalletEntryType = 'credit' | 'debit';
export type WalletEntryStatus = 'successful' | 'pending' | 'failed';

export interface Wallet {
  id: string;
  userId: string;
  walletNumber: string;
  availableBalance: string; // Stored and transmitted as decimal string for precision
  ledgerBalance: string;
  currency: 'NGN';
  isActive: boolean;
  updatedAt: string;
  isSimulated: boolean;
}

export interface WalletLedgerEntry {
  id: string;
  reference: string;
  walletId: string;
  userName?: string;
  userEmail?: string;
  type: WalletEntryType;
  channel: 'bank_transfer' | 'card_simulation' | 'service_purchase' | 'manual_adjustment';
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  status: WalletEntryStatus;
  narration: string;
  createdAt: string;
  isSimulated: boolean;
}

export interface SimulatedFundWalletPayload {
  amount: string;
  channel: 'bank_transfer' | 'card_simulation';
}

export interface ManualWalletAdjustmentPayload {
  walletId: string;
  type: WalletEntryType;
  amount: string;
  reason: string;
  authorizationCode: string;
}
