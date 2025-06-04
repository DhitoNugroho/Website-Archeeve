<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag; 
use Illuminate\Support\Str; 

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Programming', 'Web Development', 'Laravel', 'React', 'JavaScript',
            'Resep Masakan', 'Destinasi Wisata', 'Tips & Trik', 'Review Produk',
            'Tutorial', 'Startup', 'Produktivitas', 'Kesehatan Mental', 'Indonesia',
            'Teknologi Terbaru', 'Belajar Online', 'Investasi', 'Fotografi',
            'Gaming', 'Alam',
            'Tutorial Pemula', 'Tips Produktif', 'Wisata Murah', 'Makanan Viral', 'Game Indie',
            'AI', 'Machine Learning', 'Data Science', 'Cybersecurity', 'Cloud Computing'
        ];

        // Loop melalui array nama tag dan buat entri di database
        foreach ($tags as $tagName) {
            Tag::create([
                'name' => $tagName,
                'slug' => Str::slug($tagName) // Membuat slug otomatis dari nama
            ]);
        }

    
    }
}
