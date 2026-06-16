<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:reset-catalog-data')]
#[Description('Command description')]
class ResetCatalogData extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tables = [
            'user_combinations',
            'user_owned_blades',
            'user_owned_ratchets',
            'user_owned_bits',
            'user_owned_cx_lock_chips',
            'user_owned_cx_over_blades',
            'user_owned_cx_metal_blades',
            'user_owned_cx_auxiliary_blades',
            'official_setups',
            'blades',
            'ratchets',
            'bits',
            'cx_lock_chips',
            'cx_over_blades',
            'cx_metal_blades',
            'cx_auxiliary_blades',
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
            $this->info("Truncated: {$table}");
        }
    }
}
