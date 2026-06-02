<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            $table->string('manufacturer');
            $table->enum('type', ['BX', 'UX', 'CX']);

            $table->foreignId('blade_id')->nullable()->constrained('blades')->nullOnDelete();
            $table->foreignId('ratchet_id')->constrained('ratchets')->cascadeOnDelete();
            $table->foreignId('bit_id')->constrained('bits')->cascadeOnDelete();

            $table->foreignId('cx_lock_chip_id')->nullable()->constrained('cx_lock_chips')->nullOnDelete();
            $table->foreignId('cx_over_blade_id')->nullable()->constrained('cx_over_blades')->nullOnDelete();
            $table->foreignId('cx_metal_blade_id')->nullable()->constrained('cx_metal_blades')->nullOnDelete();
            $table->foreignId('cx_auxiliary_blade_id')->nullable()->constrained('cx_auxiliary_blades')->nullOnDelete();

            $table->timestamps();
        });

        DB::unprepared('
            CREATE OR REPLACE FUNCTION set_timestamps_on_insert()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.created_at = NOW();
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        ');

        DB::unprepared('
            DROP TRIGGER IF EXISTS set_timestamps_on_insert_official_setups ON official_setups;
            CREATE TRIGGER set_timestamps_on_insert_official_setups
            BEFORE INSERT ON official_setups
            FOR EACH ROW
            EXECUTE FUNCTION set_timestamps_on_insert();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('official_setups');
    }
};
