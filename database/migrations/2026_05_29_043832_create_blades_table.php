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
        Schema::create('blades', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('img_url')->nullable();
            $table->string('color')->nullable();
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
            DROP TRIGGER IF EXISTS set_timestamps_on_insert_blades ON blades;
            CREATE TRIGGER set_timestamps_on_insert_blades
            BEFORE INSERT ON blades
            FOR EACH ROW
            EXECUTE FUNCTION set_timestamps_on_insert();
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blades');
    }
};
