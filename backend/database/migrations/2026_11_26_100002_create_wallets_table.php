<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Foundational Entity #3: Wallets
     * Uses strict DECIMAL(15, 2) monetary columns — never floating-point types.
     */
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('wallet_number', 20)->unique();
            $table->decimal('available_balance', 15, 2)->default(0.00);
            $table->decimal('ledger_balance', 15, 2)->default(0.00);
            $table->string('currency', 3)->default('NGN');
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_simulated')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
