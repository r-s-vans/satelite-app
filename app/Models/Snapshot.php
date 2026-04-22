<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Snapshot extends Model
{
    protected $fillable = ['user_id', 'image_path', 'comment'];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
