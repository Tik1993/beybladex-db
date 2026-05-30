<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\CxOverBlade;

class UserOwnedCxOverBlade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cx_over_blade_id',
        'quantity',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cxOverBlade()
    {
        return $this->belongsTo(CxOverBlade::class);
    }
}