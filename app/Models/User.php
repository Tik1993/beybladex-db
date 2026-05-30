<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserOwnedBlade;
use App\Models\UserOwnedRatchet;
use App\Models\UserOwnedBit;
use App\Models\UserCombination;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    public function userOwnedBlades()
    {
        return $this->hasMany(UserOwnedBlade::class);
    }

    public function userOwnedRatchets()
    {
        return $this->hasMany(UserOwnedRatchet::class);
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
