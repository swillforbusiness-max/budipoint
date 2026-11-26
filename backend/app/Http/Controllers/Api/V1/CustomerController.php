<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WalletResource;
use App\Models\ServiceCategory;
use App\Models\Transaction;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Customer profile retrieved.',
            'data' => new UserResource($request->user()),
        ]);
    }

    public function wallet(Request $request): JsonResponse
    {
        $wallet = $request->user()->wallet()->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Simulated customer wallet balance.',
            'data' => new WalletResource($wallet),
        ]);
    }

    public function simulateFund(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:100'],
            'channel' => ['required', 'in:bank_transfer,card_simulation'],
        ]);

        $wallet = $request->user()->wallet()->firstOrFail();
        $entry = $this->walletService->adjustWalletBalance(
            $wallet,
            'credit',
            (string) $validated['amount'],
            $validated['channel'],
            'Sandbox Wallet Funding via ' . $validated['channel'],
            $request->user()
        );

        return response()->json([
            'success' => true,
            'message' => '[SIMULATED] Sandbox wallet credited.',
            'data' => [
                'wallet' => new WalletResource($wallet->fresh()),
                'entry' => new TransactionResource($entry),
            ],
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $items = Transaction::with(['user', 'serviceCategory'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Customer transactions retrieved.',
            'data' => TransactionResource::collection($items),
        ]);
    }

    public function services(): JsonResponse
    {
        $services = ServiceCategory::where('is_visible', true)->orderBy('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Platform service categories retrieved.',
            'data' => ServiceCategoryResource::collection($services),
        ]);
    }
}
