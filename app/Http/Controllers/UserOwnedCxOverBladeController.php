<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedCxOverBlade;
use Illuminate\Http\Request;

class UserOwnedCxOverBladeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedCxOverBlade::where('user_id', $request->user()->id)
                ->with('cxOverBlade')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'cx_over_blade_id' => 'required|exists:cx_over_blades,id',
        ]);

        $owned = UserOwnedCxOverBlade::firstOrCreate([
            'user_id'          => $request->user()->id,
            'cx_over_blade_id' => $request->cx_over_blade_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('cxOverBlade'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedCxOverBlade::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}