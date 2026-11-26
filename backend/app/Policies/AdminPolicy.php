<?php

namespace App\Policies;

use App\Models\User;

class AdminPolicy
{
    /**
     * Protects administrator operations and manual wallet adjustments.
     */
    public function managePlatform(User $user): bool
    {
        return $user->isAdmin() && $user->status === 'active';
    }
}
