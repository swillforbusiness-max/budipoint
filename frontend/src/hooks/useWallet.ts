import { useCallback, useEffect, useState } from 'react';
import { walletService } from '../services/wallet.service';
import type {
  ManualWalletAdjustmentPayload,
  SimulatedFundWalletPayload,
  Wallet,
  WalletLedgerEntry,
} from '../types/wallet.types';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ledger, setLedger] = useState<WalletLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletData, ledgerData] = await Promise.all([
        walletService.getWallet(),
        walletService.getLedger(),
      ]);
      setWallet(walletData);
      setLedger(ledgerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load wallet records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshWallet();
  }, [refreshWallet]);

  const simulateFundWallet = useCallback(async (payload: SimulatedFundWalletPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await walletService.simulateFunding(payload);
      setWallet(result.wallet);
      setLedger((prev) => [result.entry, ...prev]);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Simulated funding failed.';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitManualAdjustment = useCallback(async (payload: ManualWalletAdjustmentPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const entry = await walletService.submitManualAdminAdjustment(payload);
      const updatedWallet = await walletService.getWallet();
      setWallet(updatedWallet);
      setLedger((prev) => [entry, ...prev]);
      return entry;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Manual wallet adjustment failed.';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    wallet,
    ledger,
    isLoading,
    isSubmitting,
    error,
    refreshWallet,
    simulateFundWallet,
    submitManualAdjustment,
  };
}
