<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_owned_cx_lock_chips', function (Blueprint $table) {
            $table->unique(['user_id', 'cx_lock_chip_id']);
        });
    }
    public function down(): void
    {
        Schema::table('user_owned_cx_lock_chips', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'cx_lock_chip_id']);
        });
    }
};
