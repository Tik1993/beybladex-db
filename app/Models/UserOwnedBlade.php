<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Blade;
use App\Models\User;


class UserOwnedBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'blade_id',
        'user_id',
        'quantity',
        'notes'
    ];

    public function blade()
    {
        return $this->belongsTo(Blade::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}