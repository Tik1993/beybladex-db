<?php

namespace App\Http\Controllers;

use App\Models\CxMetalBlade;
use Illuminate\Http\Request;

class CxMetalBladeController extends Controller
{
    public function index()
    {
        return response()->json(
            CxMetalBlade::with(
                ['officialSetups']
            )->get()
        );
    }

    public function show(CxMetalBlade $cxMetalBlade)
    {
        return response()->json($cxMetalBlade);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'img_url' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
        ]);

        $cxMetalBlade = CxMetalBlade::create($validated);

        return response()->json($cxMetalBlade, 201);
    }

    public function update(Request $request, CxMetalBlade $cxMetalBlade)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'img_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $cxMetalBlade->update($validated);

        return response()->json($cxMetalBlade);
    }

    public function destroy(CxMetalBlade $cxMetalBlade)
    {
        $cxMetalBlade->delete();

        return response()->json(['message' => 'CX metal blade deleted']);
    }
}