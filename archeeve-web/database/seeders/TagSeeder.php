<?php

namespace Database\Seeders;

// Hapus 'use Illuminate\Database\Console\Seeds\WithoutModelEvents;' jika tidak digunakan atau menyebabkan error
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag; // Pastikan path ke model Tag Anda benar
use Illuminate\Support\Str; // Untuk membuat slug

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
            // Anda bisa menambahkan lebih banyak tag di sini
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

        // Untuk memberi tahu di console bahwa seeder berjalan (opsional)
        // $this->command->info('Tag table seeded!');
    }
}
