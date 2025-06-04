<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug']; // Pastikan 'name' dan 'slug' fillable

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }
}