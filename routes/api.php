<?php

use App\Http\Controllers\BladeController;
use App\Http\Controllers\RatchetController;
use App\Http\Controllers\BitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfficialSetupController;


Route::apiResource('blades', BladeController::class);
Route::apiResource('ratchets', RatchetController::class);
Route::apiResource('bits', BitController::class);
Route::apiResource('official-setups', OfficialSetupController::class);