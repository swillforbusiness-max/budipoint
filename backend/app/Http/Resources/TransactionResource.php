<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'reference' => $this->reference,
            'userId' => (string) $this->user_id,
            'customerName' => $this->user?->full_name ?? 'Budipoint Customer',
            'customerEmail' => $this->user?->email ?? '',
            'serviceSlug' => $this->serviceCategory?->slug ?? 'wallet-funding',
            'serviceName' => $this->serviceCategory?->name ?? 'Wallet Funding',
            'type' => $this->type,
            'amount' => number_format((float) $this->amount, 2, '.', ''),
            'fee' => number_format((float) $this->fee, 2, '.', ''),
            'status' => $this->status,
            'recipient' => $this->recipient,
            'description' => $this->description,
            'providerReference' => $this->provider_reference,
            'createdAt' => $this->created_at?->toISOString(),
            'isSimulated' => (bool) $this->is_simulated,
        ];
    }
}
