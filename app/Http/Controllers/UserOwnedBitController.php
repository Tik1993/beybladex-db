<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedBit;
use Illuminate\Http\Request;

class UserOwnedBitController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedBit::where('user_id', $request->user()->id)
                ->with('bit')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'bit_id' => 'required|exists:bits,id',
        ]);

        $owned = UserOwnedBit::firstOrCreate([
            'user_id' => $request->user()->id,
            'bit_id'  => $request->bit_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('bit'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedBit::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}