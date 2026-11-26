<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'wallet_number',
        'available_balance',
        'ledger_balance',
        'currency',
        'is_active',
        'is_simulated',
    ];

    protected function casts(): array
    {
        return [
            'available_balance' => 'decimal:2',
            'ledger_balance' => 'decimal:2',
            'is_active' => 'boolean',
            'is_simulated' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
