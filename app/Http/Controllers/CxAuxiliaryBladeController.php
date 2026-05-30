<?php

namespace App\Http\Controllers;

use App\Models\CxAuxiliaryBlade;
use Illuminate\Http\Request;

class CxAuxiliaryBladeController extends Controller
{
    public function index()
    {
        return response()->json(CxAuxiliaryBlade::all());
    }

    public function show(CxAuxiliaryBlade $cxAuxiliaryBlade)
    {
        return response()->json($cxAuxiliaryBlade);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'img_url' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
        ]);

        $cxAuxiliaryBlade = CxAuxiliaryBlade::create($validated);

        return response()->json($cxAuxiliaryBlade, 201);
    }

    public function update(Request $request, CxAuxiliaryBlade $cxAuxiliaryBlade)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'img_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $cxAuxiliaryBlade->update($validated);

        return response()->json($cxAuxiliaryBlade);
    }

    public function destroy(CxAuxiliaryBlade $cxAuxiliaryBlade)
    {
        $cxAuxiliaryBlade->delete();

        return response()->json(['message' => 'CX auxiliary blade deleted']);
    }
}