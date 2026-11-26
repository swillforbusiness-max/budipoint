<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Enforces role-based access control for Customer and Administrator endpoints.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: You do not have permission to access this environment.',
            ], 403);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Account suspended. Please contact Budipoint compliance support.',
            ], 403);
        }

        return $next($request);
    }
}
