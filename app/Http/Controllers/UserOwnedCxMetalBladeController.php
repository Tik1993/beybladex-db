<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedCxMetalBlade;
use Illuminate\Http\Request;

class UserOwnedCxMetalBladeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedCxMetalBlade::where('user_id', $request->user()->id)
                ->with('cxMetalBlade')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'cx_metal_blade_id' => 'required|exists:cx_metal_blades,id',
        ]);

        $owned = UserOwnedCxMetalBlade::firstOrCreate([
            'user_id'           => $request->user()->id,
            'cx_metal_blade_id' => $request->cx_metal_blade_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('cxMetalBlade'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedCxMetalBlade::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}