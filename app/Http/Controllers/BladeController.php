<?php

namespace App\Http\Controllers;

use App\Models\Blade;
use Illuminate\Http\Request;

class BladeController extends Controller
{
    public function index()
    {
        return response()->json(Blade::all());
    }

    public function show(Blade $blade)
    {
        return response()->json($blade);
    }

    public function store(Request $request)
    {
        $blade = Blade::create($request->only(['name', 'img_url', 'color']));

        return response()->json($blade, 201);
    }

    public function update(Request $request, Blade $blade)
    {
        $blade->update($request->only(['name', 'img_url', 'color']));

        return response()->json($blade);
    }

    public function destroy(Blade $blade)
    {
        $blade->delete();

        return response()->json(['message' => 'Blade deleted']);
    }
}