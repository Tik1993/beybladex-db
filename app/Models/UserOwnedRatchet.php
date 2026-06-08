<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ratchet;
use App\Models\User;


class UserOwnedRatchet extends Model
{
    use HasFactory;

    protected $fillable = [
        'ratchet_id',
        'user_id',
        'quantity',
        'notes'
    ];

    public function ratchet()
    {
        return $this->belongsTo(Ratchet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}