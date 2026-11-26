<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class ManualWalletAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'walletId' => ['required'],
            'type' => ['required', 'in:credit,debit'],
            'amount' => ['required', 'numeric', 'min:1'],
            'reason' => ['required', 'string', 'min:10', 'max:500'],
            'authorizationCode' => ['required', 'string', 'min:4'],
        ];
    }
}
