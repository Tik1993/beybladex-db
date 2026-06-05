<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\OfficialSetup;

// Route::get('/', function (Request $request) {
//     $search = $request->query('search');

//     $officialSetups = OfficialSetup::with([
//         'blade',
//         'ratchet',
//         'bit',
//         'cxLockChip',
//         'cxOverBlade',
//         'cxMetalBlade',
//         'cxAuxiliaryBlade',
//     ])
//     ->when($search, function ($query) use ($search) {
//         $query->where(function ($q) use ($search) {
//             $q->where('name', 'ilike', "%{$search}%")
//               ->orWhere('manufacturer', 'ilike', "%{$search}%")
//               ->orWhere('type', 'ilike', "%{$search}%")
//               ->orWhereHas('blade', fn ($bladeQuery) => $bladeQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('ratchet', fn ($ratchetQuery) => $ratchetQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('bit', fn ($bitQuery) => $bitQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('cxLockChip', fn ($cxQuery) => $cxQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('cxOverBlade', fn ($cxQuery) => $cxQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('cxMetalBlade', fn ($cxQuery) => $cxQuery->where('name', 'ilike', "%{$search}%"))
//               ->orWhereHas('cxAuxiliaryBlade', fn ($cxQuery) => $cxQuery->where('name', 'ilike', "%{$search}%"));
//         });
//     })
//     ->latest()
//     ->get();

//     return view('welcome', compact('officialSetups', 'search'));
// });

Route::get('/', function (Request $request) {
    return view('app');
});