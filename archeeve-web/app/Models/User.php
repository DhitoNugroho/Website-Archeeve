<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 
use Tymon\JWTAuth\Contracts\JWTSubject; 
use Illuminate\Support\Facades\Storage; 

class User extends Authenticatable implements JWTSubject 
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',                  
        'profile_image_path',   
        'profile_image_url',    
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'profile_image_path', 
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', // Otomatis hash password saat diset
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * Jika Anda TIDAK menyimpan profile_image_url di database dan hanya profile_image_path,
     * Anda bisa menggunakan accessor untuk meng-generate URL secara dinamis.
     * Jika Anda sudah menyimpannya di DB (seperti pada controller kita), accessor ini opsional
     * atau bisa digunakan untuk memastikan URL selalu benar.
     *
     * @var array
     */
    // protected $appends = ['full_profile_image_url']; // Contoh nama accessor

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            
        ];
    }

    // Relasi dengan Artikel
    public function articles()
    {
        return $this->hasMany(Article::class);
    }


}
