<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BladeController extends Controller
{
    public function index()
    {
        $blades = [
            ['name' => 'Wizard Rod', 'color' => 'Blue'],
            ['name' => 'Phoenix Wing', 'color' => 'Red'],
            ['name' => 'Cobalt Drake', 'color' => 'Blue'],
        ];

        return view('blades.index', compact('blades'));
    }
}