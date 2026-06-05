<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserOwnedCxAuxiliaryBlade;
use App\Models\OfficialSetup;
use App\Models\UserCombination;

class CxAuxiliaryBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        "short_name",
        'img_url',
        'color',
    ];

    public function userOwnedCxAuxiliaryBlades()
    {
        return $this->hasMany(UserOwnedCxAuxiliaryBlade::class);
    }

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class, 'cx_auxiliary_blade_id');
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class, 'cx_auxiliary_blade_id');
    }
}