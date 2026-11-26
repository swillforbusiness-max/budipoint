<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'walletNumber' => $this->wallet_number,
            'availableBalance' => number_format((float) $this->available_balance, 2, '.', ''),
            'ledgerBalance' => number_format((float) $this->ledger_balance, 2, '.', ''),
            'currency' => $this->currency,
            'isActive' => (bool) $this->is_active,
            'updatedAt' => $this->updated_at?->toISOString(),
            'isSimulated' => (bool) $this->is_simulated,
        ];
    }
}
