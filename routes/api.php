<?php

use App\Http\Controllers\BladeController;
use App\Http\Controllers\RatchetController;
use App\Http\Controllers\BitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfficialSetupController;
use App\Http\Controllers\CxLockChipController;
use App\Http\Controllers\CxOverBladeController;
use App\Http\Controllers\CxMetalBladeController;
use App\Http\Controllers\CxAuxiliaryBladeController;

Route::apiResource('blades', BladeController::class);
Route::apiResource('ratchets', RatchetController::class);
Route::apiResource('bits', BitController::class);
Route::apiResource('official-setups', OfficialSetupController::class);
Route::apiResource('cx-lock-chips', CxLockChipController::class);
Route::apiResource('cx-over-blades', CxOverBladeController::class);
Route::apiResource('cx-metal-blades', CxMetalBladeController::class);
Route::apiResource('cx-auxiliary-blades', CxAuxiliaryBladeController::class);