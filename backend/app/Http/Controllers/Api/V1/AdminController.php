<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wallet\ManualWalletAdjustmentRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\ServiceCategory;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\AuditLogService;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(
        protected WalletService $walletService,
        protected AuditLogService $auditLogService
    ) {}

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Admin overview telemetry.',
            'data' => [
                'totalRegisteredUsers' => User::where('role', 'customer')->count(),
                'activeUsers' => User::where('role', 'customer')->where('status', 'active')->count(),
                'totalTransactions' => Transaction::count(),
                'successfulTransactions' => Transaction::where('status', 'successful')->count(),
                'failedTransactions' => Transaction::where('status', 'failed')->count(),
                'pendingTransactions' => Transaction::where('status', 'pending')->count(),
                'totalTransactionVolume' => number_format((float) Transaction::sum('amount'), 2, '.', ''),
                'walletFundingVolume' => number_format(
                    (float) Transaction::where('type', 'credit')->sum('amount'),
                    2,
                    '.',
                    ''
                ),
                'revenueOverview' => number_format((float) Transaction::sum('fee'), 2, '.', ''),
                'isSimulated' => true,
            ],
        ]);
    }

    public function users(): JsonResponse
    {
        $users = User::where('role', 'customer')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Customer directory retrieved.',
            'data' => UserResource::collection($users),
        ]);
    }

    public function updateUserStatus(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,suspended,pending_verification'],
            'reason' => ['nullable', 'string'],
        ]);

        $user->update(['status' => $validated['status']]);

        $this->auditLogService->record(
            $request->user(),
            'USER_STATUS_UPDATED',
            'User',
            (string) $user->id,
            $validated['reason'] ?? 'Account status changed to ' . $validated['status'],
            ['status' => $validated['status']],
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Customer account status updated.',
            'data' => new UserResource($user),
        ]);
    }

    public function transactions(): JsonResponse
    {
        $items = Transaction::with(['user', 'serviceCategory'])->latest()->limit(100)->get();

        return response()->json([
            'success' => true,
            'message' => 'Platform transactions retrieved.',
            'data' => TransactionResource::collection($items),
        ]);
    }

    public function updateService(Request $request, ServiceCategory $serviceCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'shortDescription' => ['sometimes', 'string'],
            'status' => ['sometimes', 'in:active,ready_for_api,maintenance,disabled'],
            'isEnabled' => ['sometimes', 'boolean'],
            'isVisible' => ['sometimes', 'boolean'],
        ]);

        $serviceCategory->update([
            'name' => $validated['name'] ?? $serviceCategory->name,
            'short_description' => $validated['shortDescription'] ?? $serviceCategory->short_description,
            'status' => $validated['status'] ?? $serviceCategory->status,
            'is_enabled' => $validated['isEnabled'] ?? $serviceCategory->is_enabled,
            'is_visible' => $validated['isVisible'] ?? $serviceCategory->is_visible,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Service category configuration updated.',
            'data' => new ServiceCategoryResource($serviceCategory),
        ]);
    }

    public function manualWalletAdjustment(ManualWalletAdjustmentRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $wallet = Wallet::findOrFail($validated['walletId']);

        $transaction = $this->walletService->adjustWalletBalance(
            $wallet,
            $validated['type'],
            (string) $validated['amount'],
            'manual_adjustment',
            $validated['reason'],
            $request->user(),
            $validated['reason']
        );

        return response()->json([
            'success' => true,
            'message' => '[SIMULATED] Audited manual wallet adjustment recorded.',
            'data' => new TransactionResource($transaction),
        ]);
    }

    public function auditLogs(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Administrative audit logs retrieved.',
            'data' => AuditLog::with('actor')->latest()->limit(100)->get(),
        ]);
    }
}
