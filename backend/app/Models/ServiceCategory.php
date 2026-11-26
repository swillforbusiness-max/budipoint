<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCategory extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'short_description',
        'group',
        'icon_name',
        'status',
        'is_enabled',
        'is_visible',
        'min_amount_ngn',
        'max_amount_ngn',
        'provider_status_note',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'is_visible' => 'boolean',
            'min_amount_ngn' => 'decimal:2',
            'max_amount_ngn' => 'decimal:2',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
