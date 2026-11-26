<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Foundational Entity #5: Service Categories (All 10 platform services)
     */
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('name', 120);
            $table->text('short_description');
            $table->string('group', 30)->default('main')->index(); // main | additional
            $table->string('icon_name', 40);
            $table->string('status', 30)->default('ready_for_api')->index();
            $table->boolean('is_enabled')->default(true)->index();
            $table->boolean('is_visible')->default(true)->index();
            $table->decimal('min_amount_ngn', 15, 2)->default(100.00);
            $table->decimal('max_amount_ngn', 15, 2)->default(100000.00);
            $table->string('provider_status_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_categories');
    }
};
