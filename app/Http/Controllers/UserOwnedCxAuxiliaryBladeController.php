<?php

namespace App\Http\Controllers;

use App\Models\UserOwnedCxAuxiliaryBlade;
use Illuminate\Http\Request;

class UserOwnedCxAuxiliaryBladeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            UserOwnedCxAuxiliaryBlade::where('user_id', $request->user()->id)
                ->with('cxAuxiliaryBlade')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'cx_auxiliary_blade_id' => 'required|exists:cx_auxiliary_blades,id',
        ]);

        $owned = UserOwnedCxAuxiliaryBlade::firstOrCreate([
            'user_id'               => $request->user()->id,
            'cx_auxiliary_blade_id' => $request->cx_auxiliary_blade_id,
        ], [
            'quantity' => 1,
        ]);

        return response()->json($owned->load('cxAuxiliaryBlade'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $owned = UserOwnedCxAuxiliaryBlade::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $owned->delete();

        return response()->json(['message' => 'Removed']);
    }
}