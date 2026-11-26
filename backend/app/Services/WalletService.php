<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class WalletService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Atomically credits or debits a wallet inside a PostgreSQL database transaction with row locking.
     */
    public function adjustWalletBalance(
        Wallet $wallet,
        string $type,
        string $amountDecimal,
        string $channel,
        string $description,
        ?User $actor = null,
        ?string $auditReason = null
    ): Transaction {
        return DB::transaction(function () use (
            $wallet,
            $type,
            $amountDecimal,
            $channel,
            $description,
            $actor,
            $auditReason
        ) {
            /** @var Wallet $lockedWallet */
            $lockedWallet = Wallet::where('id', $wallet->id)->lockForUpdate()->firstOrFail();

            $amount = round((float) $amountDecimal, 2);
            if ($amount <= 0) {
                throw new InvalidArgumentException('Amount must be greater than zero.');
            }

            $before = round((float) $lockedWallet->available_balance, 2);

            if ($type === 'debit' && $before < $amount) {
                throw new InvalidArgumentException('Insufficient wallet balance for this debit operation.');
            }

            $after = $type === 'credit'
                ? round($before + $amount, 2)
                : round($before - $amount, 2);

            $lockedWallet->update([
                'available_balance' => number_format($after, 2, '.', ''),
                'ledger_balance' => number_format($after, 2, '.', ''),
            ]);

            $transaction = Transaction::create([
                'reference' => 'BDP-WLT-' . strtoupper(Str::random(10)),
                'user_id' => $lockedWallet->user_id,
                'wallet_id' => $lockedWallet->id,
                'type' => $type,
                'channel' => $channel,
                'amount' => number_format($amount, 2, '.', ''),
                'fee' => '0.00',
                'balance_before' => number_format($before, 2, '.', ''),
                'balance_after' => number_format($after, 2, '.', ''),
                'status' => 'successful',
                'recipient' => 'Wallet #' . $lockedWallet->wallet_number,
                'description' => '[SIMULATED] ' . $description,
                'provider_reference' => 'SIM-LEDGER-' . strtoupper(Str::random(8)),
                'is_simulated' => true,
            ]);

            if ($auditReason) {
                $this->auditLogService->record(
                    $actor,
                    'MANUAL_WALLET_' . strtoupper($type),
                    'Wallet',
                    (string) $lockedWallet->id,
                    $auditReason,
                    [
                        'transaction_reference' => $transaction->reference,
                        'amount' => number_format($amount, 2, '.', ''),
                        'balance_before' => number_format($before, 2, '.', ''),
                        'balance_after' => number_format($after, 2, '.', ''),
                    ]
                );
            }

            return $transaction;
        });
    }
}
