<?php

namespace App\Http\Controllers;

use App\Models\CxLockChip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CxLockChipController extends Controller
{
    public function index()
    {
        return response()->json(
            Cache::remember('cxlockchips',86400, function(){
                return CxLockChip::with(
                    ['officialSetups']
                )->get()->toArray();
            })
        );
    }

    public function show(CxLockChip $cxLockChip)
    {
        return response()->json($cxLockChip);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'img_url' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
        ]);

        $cxLockChip = CxLockChip::create($validated);

        return response()->json($cxLockChip, 201);
    }

    public function update(Request $request, CxLockChip $cxLockChip)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'img_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'color' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $cxLockChip->update($validated);

        return response()->json($cxLockChip);
    }

    public function destroy(CxLockChip $cxLockChip)
    {
        $cxLockChip->delete();

        return response()->json(['message' => 'CX lock chip deleted']);
    }
}