<?php

namespace App\Http\Controllers;

use App\Models\Ratchet;
use Illuminate\Http\Request;

class RatchetController extends Controller
{
    public function index()
    {
        return response()->json(
            Ratchet::with(
                ['officialSetups']
            )->get()
        );
    }

    public function show(Ratchet $ratchet)
    {
        return response()->json($ratchet);
    }

    public function store(Request $request)
    {
        $ratchet = Ratchet::create($request->only(['name', 'img_url', 'color']));

        return response()->json($ratchet, 201);
    }

    public function update(Request $request, Ratchet $ratchet)
    {
        $ratchet->update($request->only(['name', 'img_url', 'color']));

        return response()->json($ratchet);
    }

    public function destroy(Ratchet $ratchet)
    {
        $ratchet->delete();

        return response()->json(['message' => 'Ratchet deleted']);
    }
}