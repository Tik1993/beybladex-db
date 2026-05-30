<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Blade;
use App\Models\Ratchet;
use App\Models\Bit;
use App\Models\CxLockChip;
use App\Models\CxOverBlade;
use App\Models\CxMetalBlade;
use App\Models\CxAuxiliaryBlade;

class OfficialSetup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manufacturer',
        'type',
        'blade_id',
        'ratchet_id',
        'bit_id',
        'cx_lock_chip_id',
        'cx_over_blade_id',
        'cx_metal_blade_id',
        'cx_auxiliary_blade_id',
    ];

    public function blade()
    {
        return $this->belongsTo(Blade::class);
    }

    public function ratchet()
    {
        return $this->belongsTo(Ratchet::class);
    }

    public function bit()
    {
        return $this->belongsTo(Bit::class);
    }

    public function cxLockChip()
    {
        return $this->belongsTo(CxLockChip::class, 'cx_lock_chip_id');
    }

    public function cxOverBlade()
    {
        return $this->belongsTo(CxOverBlade::class, 'cx_over_blade_id');
    }

    public function cxMetalBlade()
    {
        return $this->belongsTo(CxMetalBlade::class, 'cx_metal_blade_id');
    }

    public function cxAuxiliaryBlade()
    {
        return $this->belongsTo(CxAuxiliaryBlade::class, 'cx_auxiliary_blade_id');
    }
}