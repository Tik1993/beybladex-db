<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Bit;
use App\Models\User;


class UserOwnedBit extends Model
{
    use HasFactory;

    protected $fillable = [
        'bit_id',
        'user_id',
        'quantity',
        'notes'
    ];

    public function bit()
    {
        return $this->belongsTo(Bit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}