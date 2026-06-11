<?php

namespace App\Http\Controllers;

use App\Models\UserCombination;
use Illuminate\Http\Request;

class UserCombinationController extends Controller
{
    // GET /api/user/combinations
    public function index(Request $request)
    {
        return response()->json(
            UserCombination::where('user_id', $request->user()->id)
                ->with([
                    'blade',
                    'ratchet',
                    'bit',
                    'cxLockChip',
                    'cxOverBlade',
                    'cxMetalBlade',
                    'cxAuxiliaryBlade',
                ])
                ->latest()
                ->get()
        );
    }

    // POST /api/user/combinations
    public function store(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'type'                  => 'required|in:BX,UX,CX',
            'ratchet_id'            => 'required|exists:ratchets,id',
            'bit_id'                => 'required|exists:bits,id',
            'blade_id'              => 'nullable|exists:blades,id',
            'cx_lock_chip_id'       => 'nullable|exists:cx_lock_chips,id',
            'cx_over_blade_id'      => 'nullable|exists:cx_over_blades,id',
            'cx_metal_blade_id'     => 'nullable|exists:cx_metal_blades,id',
            'cx_auxiliary_blade_id' => 'nullable|exists:cx_auxiliary_blades,id',
            'notes'                 => 'nullable|string',
        ]);

        $combo = UserCombination::create([
            'user_id'               => $request->user()->id,
            'name'                  => $request->name,
            'type'                  => $request->type,
            'ratchet_id'            => $request->ratchet_id,
            'bit_id'                => $request->bit_id,
            'blade_id'              => $request->blade_id,
            'cx_lock_chip_id'       => $request->cx_lock_chip_id,
            'cx_over_blade_id'      => $request->cx_over_blade_id,
            'cx_metal_blade_id'     => $request->cx_metal_blade_id,
            'cx_auxiliary_blade_id' => $request->cx_auxiliary_blade_id,
            'notes'                 => $request->notes,
        ]);

        return response()->json($combo->load([
            'blade',
            'ratchet',
            'bit',
            'cxLockChip',
            'cxOverBlade',
            'cxMetalBlade',
            'cxAuxiliaryBlade',
        ]), 201);
    }

    // PUT /api/user/combinations/{id}
    public function update(Request $request, $id)
    {
        $combo = UserCombination::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $combo->update(['notes' => $request->notes]);

        return response()->json($combo->load([
            'blade',
            'ratchet',
            'bit',
            'cxLockChip',
            'cxOverBlade',
            'cxMetalBlade',
            'cxAuxiliaryBlade',
        ]));
    }

    // DELETE /api/user/combinations/{id}
    public function destroy(Request $request, $id)
    {
        $combo = UserCombination::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $combo->delete();

        return response()->json(['message' => 'Deleted']);
    }
}