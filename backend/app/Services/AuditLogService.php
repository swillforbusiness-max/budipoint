<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogService
{
    public function record(
        ?User $actor,
        string $action,
        string $entityType,
        string $entityId,
        string $reason,
        array $metadata = [],
        ?string $ipAddress = null
    ): AuditLog {
        return AuditLog::create([
            'actor_id' => $actor?->id,
            'actor_role' => $actor?->role ?? 'system',
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'reason' => $reason,
            'metadata' => $metadata,
            'ip_address' => $ipAddress ?? '127.0.0.1',
        ]);
    }
}
