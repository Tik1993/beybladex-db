<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OfficialSetup;
use App\Models\UserOwnedBit;
use App\Models\UserCombination;

class Bit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        "short_name",
        'img_url',
        'color',
    ];

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class);
    }

    public function userOwnedBits()
    {
        return $this->hasMany(UserOwnedBit::class);
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class);
    }
}