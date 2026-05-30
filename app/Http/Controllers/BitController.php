<?php

namespace App\Http\Controllers;

use App\Models\Bit;
use Illuminate\Http\Request;

class BitController extends Controller
{
    public function index()
    {
        return response()->json(Bit::all());
    }

    public function show(Bit $bit)
    {
        return response()->json($bit);
    }

    public function store(Request $request)
    {
        $bit = Bit::create($request->only(['name', 'img_url', 'color']));

        return response()->json($bit, 201);
    }

    public function update(Request $request, Bit $bit)
    {
        $bit->update($request->only(['name', 'img_url', 'color']));

        return response()->json($bit);
    }

    public function destroy(Bit $bit)
    {
        $bit->delete();

        return response()->json(['message' => 'Bit deleted']);
    }
}