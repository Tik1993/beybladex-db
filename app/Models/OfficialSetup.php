<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Blade;
use App\Models\Bit;
use App\Models\Ratchet;

class OfficialSetup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'manufacturer',
        'blade_id',
        'ratchet_id',
        'bit_id',
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
}