<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_combinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('blade_id')->constrained('blades')->cascadeOnDelete();
            $table->foreignId('ratchet_id')->constrained('ratchets')->cascadeOnDelete();
            $table->foreignId('bit_id')->constrained('bits')->cascadeOnDelete();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->boolean('is_official')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_combinations');
    }
};
