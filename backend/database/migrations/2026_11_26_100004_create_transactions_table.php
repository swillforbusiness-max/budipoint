<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Foundational Entity #4: Transactions
     * Uses strict DECIMAL(15, 2) for all financial amounts, balance snapshots, and fees.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 64)->unique();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('wallet_id')->constrained('wallets')->restrictOnDelete();
            $table->foreignId('service_category_id')->nullable()->constrained('service_categories')->nullOnDelete();
            $table->string('type', 20)->index(); // credit | debit
            $table->string('channel', 40)->default('service_purchase')->index();
            $table->decimal('amount', 15, 2);
            $table->decimal('fee', 15, 2)->default(0.00);
            $table->decimal('balance_before', 15, 2);
            $table->decimal('balance_after', 15, 2);
            $table->string('status', 30)->default('pending')->index(); // successful | pending | failed
            $table->string('recipient')->nullable();
            $table->string('description');
            $table->string('provider_reference', 100)->nullable()->index();
            $table->jsonb('provider_payload')->nullable();
            $table->boolean('is_simulated')->default(true)->index();
            $table->timestamps();

            $table->index(['user_id', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
