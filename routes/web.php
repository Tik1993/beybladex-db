<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BladeController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/blades', [BladeController::class, 'index']);