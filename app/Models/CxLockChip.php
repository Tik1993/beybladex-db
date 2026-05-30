<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UserOwnedCxLockChip;
use App\Models\OfficialSetup;
use App\Models\UserCombination;

class CxLockChip extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'img_url',
        'color',
    ];

    public function userOwnedCxLockChips()
    {
        return $this->hasMany(UserOwnedCxLockChip::class);
    }

    public function officialSetups()
    {
        return $this->hasMany(OfficialSetup::class, 'cx_lock_chip_id');
    }

    public function userCombinations()
    {
        return $this->hasMany(UserCombination::class, 'cx_lock_chip_id');
    }
}