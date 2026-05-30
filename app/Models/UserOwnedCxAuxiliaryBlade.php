<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\CxAuxiliaryBlade;

class UserOwnedCxAuxiliaryBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cx_auxiliary_blade_id',
        'quantity',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cxAuxiliaryBlade()
    {
        return $this->belongsTo(CxAuxiliaryBlade::class);
    }
}