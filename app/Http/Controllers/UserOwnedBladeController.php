<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedBlade;
use Illuminate\Http\Request;

class UserOwnedBladeController extends Controller
{
    // GET /api/user/blades
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedBlade::where('user_id', $request->user()->id)
                ->with('blade')
                ->get()
        );
    }

    // POST /api/user/blades
    public function store(Request $request)
    {
        $request->validate([
            'blade_id' => 'required|exists:blades,id',
        ]);

        $owned = UserOwnedBlade::firstOrCreate([
            'user_id'  => $request->user()->id,
            'blade_id' => $request->blade_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('blade'), 201);
    }

    // DELETE /api/user/blades/{id}
    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedBlade::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}
