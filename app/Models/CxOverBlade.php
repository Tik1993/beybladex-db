<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserOwnedCxOverBlade;
use App\Models\OfficialSetup;
use App\Models\UserCombination;

class CxOverBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'img_url',
        'color',
    ];

    public function userOwnedCxOverBlades()
    {
        return $this->hasMany(UserOwnedCxOverBlade::class);
    }

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class, 'cx_over_blade_id');
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class, 'cx_over_blade_id');
    }
}