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
        Schema::create('official_setups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('blade_id')->constrained('blades')->cascadeOnDelete();
            $table->foreignId('ratchet_id')->constrained('ratchets')->cascadeOnDelete();
            $table->foreignId('bit_id')->constrained('bits')->cascadeOnDelete();
            $table->string('type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('official_setups');
    }
};
