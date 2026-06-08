<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedCxLockChip;
use Illuminate\Http\Request;

class UserOwnedCxLockChipController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedCxLockChip::where('user_id', $request->user()->id)
                ->with('cxLockChip')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'cx_lock_chip_id' => 'required|exists:cx_lock_chips,id',
        ]);

        $owned = UserOwnedCxLockChip::firstOrCreate([
            'user_id'         => $request->user()->id,
            'cx_lock_chip_id' => $request->cx_lock_chip_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('cxLockChip'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedCxLockChip::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}