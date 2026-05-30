<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OfficialSetup;
use App\Models\UserOwnedBlade;
use App\Models\UserCombination;

class Blade extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'img_url',
        'color',
    ];

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class);
    }

    public function userOwnedBlades()
    {
        return $this->hasMany(UserOwnedBlade::class);
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class);
    }
}