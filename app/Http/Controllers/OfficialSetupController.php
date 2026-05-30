<?php

namespace App\Http\Controllers;

use App\Models\Blade;
use App\Models\Bit;
use App\Models\CxAuxiliaryBlade;
use App\Models\CxLockChip;
use App\Models\CxMetalBlade;
use App\Models\CxOverBlade;
use App\Models\OfficialSetup;
use App\Models\Ratchet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class OfficialSetupController extends Controller
{
    public function index()
    {
        return response()->json(
            OfficialSetup::with([
                'blade',
                'ratchet',
                'bit',
                'cxLockChip',
                'cxOverBlade',
                'cxMetalBlade',
                'cxAuxiliaryBlade',
            ])->get()
        );
    }

    public function show(OfficialSetup $officialSetup)
    {
        return response()->json(
            $officialSetup->load([
                'blade',
                'ratchet',
                'bit',
                'cxLockChip',
                'cxOverBlade',
                'cxMetalBlade',
                'cxAuxiliaryBlade',
            ])
        );
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'manufacturer' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['BX', 'UX', 'CX'])],

            'blade.name' => ['nullable', 'string', 'max:255'],
            'blade.img_url' => ['nullable', 'string', 'max:255'],
            'blade.color' => ['nullable', 'string', 'max:255'],

            'ratchet.name' => ['required', 'string', 'max:255'],
            'ratchet.img_url' => ['nullable', 'string', 'max:255'],
            'ratchet.color' => ['nullable', 'string', 'max:255'],

            'bit.name' => ['required', 'string', 'max:255'],
            'bit.img_url' => ['nullable', 'string', 'max:255'],
            'bit.color' => ['nullable', 'string', 'max:255'],

            'cx_lock_chip.name' => ['nullable', 'string', 'max:255'],
            'cx_lock_chip.img_url' => ['nullable', 'string', 'max:255'],
            'cx_lock_chip.color' => ['nullable', 'string', 'max:255'],

            'cx_over_blade.name' => ['nullable', 'string', 'max:255'],
            'cx_over_blade.img_url' => ['nullable', 'string', 'max:255'],
            'cx_over_blade.color' => ['nullable', 'string', 'max:255'],

            'cx_metal_blade.name' => ['nullable', 'string', 'max:255'],
            'cx_metal_blade.img_url' => ['nullable', 'string', 'max:255'],
            'cx_metal_blade.color' => ['nullable', 'string', 'max:255'],

            'cx_auxiliary_blade.name' => ['nullable', 'string', 'max:255'],
            'cx_auxiliary_blade.img_url' => ['nullable', 'string', 'max:255'],
            'cx_auxiliary_blade.color' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $officialSetup = DB::transaction(function () use ($validated) {
            $bladeId = null;
            $cxLockChipId = null;
            $cxOverBladeId = null;
            $cxMetalBladeId = null;
            $cxAuxiliaryBladeId = null;

            if ($validated['type'] === 'CX') {
                $cxLockChip = CxLockChip::create([
                    'name' => $validated['cx_lock_chip']['name'] ?? null,
                    'img_url' => $validated['cx_lock_chip']['img_url'] ?? null,
                    'color' => $validated['cx_lock_chip']['color'] ?? null,
                ]);

                $cxOverBlade = CxOverBlade::create([
                    'name' => $validated['cx_over_blade']['name'] ?? null,
                    'img_url' => $validated['cx_over_blade']['img_url'] ?? null,
                    'color' => $validated['cx_over_blade']['color'] ?? null,
                ]);

                $cxMetalBlade = CxMetalBlade::create([
                    'name' => $validated['cx_metal_blade']['name'] ?? null,
                    'img_url' => $validated['cx_metal_blade']['img_url'] ?? null,
                    'color' => $validated['cx_metal_blade']['color'] ?? null,
                ]);

                $cxAuxiliaryBlade = CxAuxiliaryBlade::create([
                    'name' => $validated['cx_auxiliary_blade']['name'] ?? null,
                    'img_url' => $validated['cx_auxiliary_blade']['img_url'] ?? null,
                    'color' => $validated['cx_auxiliary_blade']['color'] ?? null,
                ]);

                $cxLockChipId = $cxLockChip->id;
                $cxOverBladeId = $cxOverBlade->id;
                $cxMetalBladeId = $cxMetalBlade->id;
                $cxAuxiliaryBladeId = $cxAuxiliaryBlade->id;
            } else {
                $blade = Blade::create([
                    'name' => $validated['blade']['name'] ?? null,
                    'img_url' => $validated['blade']['img_url'] ?? null,
                    'color' => $validated['blade']['color'] ?? null,
                ]);

                $bladeId = $blade->id;
            }

            $ratchet = Ratchet::create([
                'name' => $validated['ratchet']['name'],
                'img_url' => $validated['ratchet']['img_url'] ?? null,
                'color' => $validated['ratchet']['color'] ?? null,
            ]);

            $bit = Bit::create([
                'name' => $validated['bit']['name'],
                'img_url' => $validated['bit']['img_url'] ?? null,
                'color' => $validated['bit']['color'] ?? null,
            ]);

            return OfficialSetup::create([
                'name' => $validated['name'],
                'manufacturer' => $validated['manufacturer'],
                'type' => $validated['type'],

                'blade_id' => $bladeId,
                'ratchet_id' => $ratchet->id,
                'bit_id' => $bit->id,

                'cx_lock_chip_id' => $cxLockChipId,
                'cx_over_blade_id' => $cxOverBladeId,
                'cx_metal_blade_id' => $cxMetalBladeId,
                'cx_auxiliary_blade_id' => $cxAuxiliaryBladeId,
            ]);
        });

        return response()->json(
            $officialSetup->load([
                'blade',
                'ratchet',
                'bit',
                'cxLockChip',
                'cxOverBlade',
                'cxMetalBlade',
                'cxAuxiliaryBlade',
            ]),
            201
        );
    }

    public function update(Request $request, OfficialSetup $officialSetup)
    {
        $validated = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'manufacturer' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', Rule::in(['BX', 'UX', 'CX'])],

            'blade_id' => ['nullable', 'exists:blades,id'],
            'ratchet_id' => ['sometimes', 'exists:ratchets,id'],
            'bit_id' => ['sometimes', 'exists:bits,id'],

            'cx_lock_chip_id' => ['nullable', 'exists:cx_lock_chips,id'],
            'cx_over_blade_id' => ['nullable', 'exists:cx_over_blades,id'],
            'cx_metal_blade_id' => ['nullable', 'exists:cx_metal_blades,id'],
            'cx_auxiliary_blade_id' => ['nullable', 'exists:cx_auxiliary_blades,id'],
        ])->validate();

        $officialSetup->update($validated);

        return response()->json(
            $officialSetup->load([
                'blade',
                'ratchet',
                'bit',
                'cxLockChip',
                'cxOverBlade',
                'cxMetalBlade',
                'cxAuxiliaryBlade',
            ])
        );
    }

    public function destroy(OfficialSetup $officialSetup)
    {
        $officialSetup->delete();

        return response()->json(['message' => 'Official setup deleted']);
    }
}