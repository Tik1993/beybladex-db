<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BladeController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/blades', [BladeController::class, 'index']);
Route::view('/official-setups/new', 'app');