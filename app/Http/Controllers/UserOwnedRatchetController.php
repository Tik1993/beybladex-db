<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedRatchet;
use Illuminate\Http\Request;

class UserOwnedRatchetController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedRatchet::where('user_id', $request->user()->id)
                ->with('ratchet')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'ratchet_id' => 'required|exists:ratchets,id',
        ]);

        $owned = UserOwnedRatchet::firstOrCreate([
            'user_id'    => $request->user()->id,
            'ratchet_id' => $request->ratchet_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('ratchet'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedRatchet::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}