<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CustomerController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public Health & Service Catalog
    Route::get('/health', fn () => response()->json([
        'success' => true,
        'platform' => 'Budipoint Digital Services & Fintech API',
        'version' => 'v1',
        'mode' => 'simulated-sandbox',
    ]));

    Route::get('/services', [CustomerController::class, 'services']);

    // Authentication Endpoints
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // Protected Customer Endpoints
    Route::middleware(['auth:sanctum', 'role:customer'])->prefix('customer')->group(function () {
        Route::get('/profile', [CustomerController::class, 'profile']);
        Route::get('/wallet', [CustomerController::class, 'wallet']);
        Route::post('/wallet/simulate-fund', [CustomerController::class, 'simulateFund']);
        Route::get('/transactions', [CustomerController::class, 'transactions']);
    });

    // Protected Administrator Endpoints
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/transactions', [AdminController::class, 'transactions']);
        Route::patch('/services/{serviceCategory}', [AdminController::class, 'updateService']);
        Route::post('/wallets/manual-adjustment', [AdminController::class, 'manualWalletAdjustment']);
        Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
    });
});
