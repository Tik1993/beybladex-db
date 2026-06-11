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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserOwnedBladeController;
use App\Http\Controllers\UserOwnedRatchetController;
use App\Http\Controllers\UserOwnedBitController;
use App\Http\Controllers\UserOwnedCxLockChipController;
use App\Http\Controllers\UserOwnedCxOverBladeController;
use App\Http\Controllers\UserOwnedCxMetalBladeController;
use App\Http\Controllers\UserOwnedCxAuxiliaryBladeController;
use App\Http\Controllers\UserCombinationController;

Route::apiResource('blades', BladeController::class);
Route::apiResource('ratchets', RatchetController::class);
Route::apiResource('bits', BitController::class);
Route::apiResource('official-setups', OfficialSetupController::class);
Route::apiResource('cx-lock-chips', CxLockChipController::class);
Route::apiResource('cx-over-blades', CxOverBladeController::class);
Route::apiResource('cx-metal-blades', CxMetalBladeController::class);
Route::apiResource('cx-auxiliary-blades', CxAuxiliaryBladeController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/blades',               [UserOwnedBladeController::class, 'index']);
    Route::post('/user/blades',              [UserOwnedBladeController::class, 'store']);
    Route::delete('/user/blades/{id}',       [UserOwnedBladeController::class, 'destroy']);

    Route::get('/user/ratchets',             [UserOwnedRatchetController::class, 'index']);
    Route::post('/user/ratchets',            [UserOwnedRatchetController::class, 'store']);
    Route::delete('/user/ratchets/{id}',     [UserOwnedRatchetController::class, 'destroy']);

    Route::get('/user/bits',                 [UserOwnedBitController::class, 'index']);
    Route::post('/user/bits',                [UserOwnedBitController::class, 'store']);
    Route::delete('/user/bits/{id}',         [UserOwnedBitController::class, 'destroy']);

    Route::get('/user/cx-lock-chips',        [UserOwnedCxLockChipController::class, 'index']);
    Route::post('/user/cx-lock-chips',       [UserOwnedCxLockChipController::class, 'store']);
    Route::delete('/user/cx-lock-chips/{id}',[UserOwnedCxLockChipController::class, 'destroy']);

    Route::get('/user/cx-over-blades',        [UserOwnedCxOverBladeController::class, 'index']);
    Route::post('/user/cx-over-blades',       [UserOwnedCxOverBladeController::class, 'store']);
    Route::delete('/user/cx-over-blades/{id}',[UserOwnedCxOverBladeController::class, 'destroy']);

    Route::get('/user/cx-metal-blades',        [UserOwnedCxMetalBladeController::class, 'index']);
    Route::post('/user/cx-metal-blades',       [UserOwnedCxMetalBladeController::class, 'store']);
    Route::delete('/user/cx-metal-blades/{id}',[UserOwnedCxMetalBladeController::class, 'destroy']);

    Route::get('/user/cx-auxiliary-blades',        [UserOwnedCxAuxiliaryBladeController::class, 'index']);
    Route::post('/user/cx-auxiliary-blades',       [UserOwnedCxAuxiliaryBladeController::class, 'store']);
    Route::delete('/user/cx-auxiliary-blades/{id}',[UserOwnedCxAuxiliaryBladeController::class, 'destroy']);

    Route::get('/user/combinations',        [UserCombinationController::class, 'index']);
    Route::post('/user/combinations',       [UserCombinationController::class, 'store']);
    Route::put('/user/combinations/{id}',   [UserCombinationController::class, 'update']);
    Route::delete('/user/combinations/{id}',[UserCombinationController::class, 'destroy']);
});
