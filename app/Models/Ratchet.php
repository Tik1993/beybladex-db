<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OfficialSetup;
use App\Models\UserOwnedRatchet;
use App\Models\UserCombination;

class Ratchet extends Model
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

    public function userOwnedRatchets()
    {
        return $this->hasMany(UserOwnedRatchet::class);
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class);
    }
}