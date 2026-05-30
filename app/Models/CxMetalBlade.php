<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserOwnedCxMetalBlade;
use App\Models\OfficialSetup;
use App\Models\UserCombination;

class CxMetalBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'img_url',
        'color',
    ];

    public function userOwnedCxMetalBlades()
    {
        return $this->hasMany(UserOwnedCxMetalBlade::class);
    }

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class, 'cx_metal_blade_id');
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class, 'cx_metal_blade_id');
    }
}