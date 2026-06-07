<?php

namespace App\Http\Controllers;

use App\Models\CxOverBlade;
use Illuminate\Http\Request;

class CxOverBladeController extends Controller
{
    public function index()
    {
        return response()->json(
            CxOverBlade::with(
                ['officialSetups']
            )->get()
        );
    }

    public function show(CxOverBlade $cxOverBlade)
    {
        return response()->json($cxOverBlade);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'img_url' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
        ]);

        $cxOverBlade = CxOverBlade::create($validated);

        return response()->json($cxOverBlade, 201);
    }

    public function update(Request $request, CxOverBlade $cxOverBlade)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'img_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $cxOverBlade->update($validated);

        return response()->json($cxOverBlade);
    }

    public function destroy(CxOverBlade $cxOverBlade)
    {
        $cxOverBlade->delete();

        return response()->json(['message' => 'CX over blade deleted']);
    }
}