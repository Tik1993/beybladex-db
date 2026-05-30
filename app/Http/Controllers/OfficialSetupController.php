<?php

namespace App\Http\Controllers;

use App\Models\Blade;
use App\Models\Bit;
use App\Models\OfficialSetup;
use App\Models\Ratchet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OfficialSetupController extends Controller
{
    public function index()
    {
        return response()->json(
            OfficialSetup::with(['blade', 'ratchet', 'bit'])->get()
        );
    }

    public function show(OfficialSetup $officialSetup)
    {
        return response()->json(
            $officialSetup->load(['blade', 'ratchet', 'bit'])
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'manufacturer' => ['required', 'in:Hasbro,Takara Tomy'],
            'type' => ['nullable', 'string'],

            'blade.name' => ['required', 'string'],
            'blade.img_url' => ['nullable', 'string'],
            'blade.color' => ['nullable', 'string'],

            'ratchet.name' => ['required', 'string'],
            'ratchet.img_url' => ['nullable', 'string'],
            'ratchet.color' => ['nullable', 'string'],

            'bit.name' => ['required', 'string'],
            'bit.img_url' => ['nullable', 'string'],
            'bit.color' => ['nullable', 'string'],
        ]);

        $officialSetup = DB::transaction(function () use ($validated) {
            $blade = Blade::create([
                'name' => $validated['blade']['name'],
                'img_url' => $validated['blade']['img_url'] ?? null,
                'color' => $validated['blade']['color'] ?? null,
            ]);

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
                'type' => $validated['type'] ?? null,
                'blade_id' => $blade->id,
                'ratchet_id' => $ratchet->id,
                'bit_id' => $bit->id,
            ]);
        });

        return response()->json(
            $officialSetup->load(['blade', 'ratchet', 'bit']),
            201
        );
    }

    public function update(Request $request, OfficialSetup $officialSetup)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string'],
            'manufacturer' => ['sometimes', 'in:Hasbro,Takara Tomy'],
            'type' => ['sometimes', 'nullable', 'string'],
        ]);

        $officialSetup->update($validated);

        return response()->json($officialSetup->load(['blade', 'ratchet', 'bit']));
    }

    public function destroy(OfficialSetup $officialSetup)
    {
        $officialSetup->delete();

        return response()->json(['message' => 'Official setup deleted']);
    }
}