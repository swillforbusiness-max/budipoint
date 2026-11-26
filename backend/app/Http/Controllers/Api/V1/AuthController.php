<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $newUser = User::create([
                'full_name' => $validated['fullName'],
                'email' => strtolower($validated['email']),
                'phone_number' => $validated['phoneNumber'],
                'role' => 'customer',
                'status' => 'active',
                'password' => Hash::make($validated['password']),
                'last_login_at' => now(),
            ]);

            Wallet::create([
                'user_id' => $newUser->id,
                'wallet_number' => (string) random_int(9000000000, 9999999999),
                'available_balance' => '0.00',
                'ledger_balance' => '0.00',
                'currency' => 'NGN',
                'is_active' => true,
                'is_simulated' => true,
            ]);

            return $newUser;
        });

        $token = $user->createToken('budipoint-customer-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Customer account registered in sandbox mode.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'isSimulated' => true,
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', strtolower($validated['email']))->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email address or password.',
            ], 401);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'This account is currently suspended.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('budipoint-api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'isSimulated' => true,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Authenticated user profile.',
            'data' => new UserResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Signed out successfully.',
            'data' => ['loggedOut' => true],
        ]);
    }
}
