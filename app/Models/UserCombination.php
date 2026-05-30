<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Blade;
use App\Models\Ratchet;
use App\Models\Bit;
use App\Models\User;


class UserCombination extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blade_id',
        'ratchet_id',
        'bit_id',
        'name',
        'notes',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}