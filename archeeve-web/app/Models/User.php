<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Uncomment jika Anda menggunakan verifikasi email
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Untuk Laravel Sanctum (jika digunakan)
use Tymon\JWTAuth\Contracts\JWTSubject; // Untuk Tymon JWT Auth
use Illuminate\Support\Facades\Storage; // Diperlukan jika Anda ingin menambahkan accessor untuk URL gambar

class User extends Authenticatable implements JWTSubject // Hapus MustVerifyEmail jika tidak digunakan
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
        'bio',                  // <-- DITAMBAHKAN
        'profile_image_path',   // <-- DITAMBAHKAN (untuk path relatif di storage)
        'profile_image_url',    // <-- DITAMBAHKAN (untuk URL lengkap yang bisa diakses)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'profile_image_path', // Sembunyikan path internal jika hanya URL yang ingin diekspos via API
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
            // Anda bisa menambahkan data lain ke JWT jika perlu
            // 'name' => $this->name,
            // 'profile_image_url' => $this->profile_image_url, // Atau this->getFullProfileImageUrlAttribute() jika pakai accessor
        ];
    }

    // Relasi dengan Artikel
    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    /**
     * Accessor contoh untuk profile_image_url.
     * Gunakan ini jika Anda HANYA menyimpan profile_image_path di database.
     * Jika Anda sudah menyimpan profile_image_url secara langsung di database melalui controller,
     * maka accessor ini mungkin tidak diperlukan, atau bisa disesuaikan.
     * Pastikan nama accessor (getFullProfileImageUrlAttribute) unik dan $appends di atas di-uncomment.
     */
    /*
    public function getFullProfileImageUrlAttribute(): ?string
    {
        if ($this->profile_image_path && Storage::disk('public')->exists($this->profile_image_path)) {
            return Storage::disk('public')->url($this->profile_image_path);
        }
        // Kembalikan URL placeholder default jika tidak ada gambar atau path tidak valid
        // return asset('images/default-avatar.png'); // Contoh placeholder
        return null;
    }
    */
}
