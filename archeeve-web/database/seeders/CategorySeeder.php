<?php

namespace Database\Seeders;

// Hapus 'use Illuminate\Database\Console\Seeds\WithoutModelEvents;' jika tidak digunakan atau jika menyebabkan error
// use Illuminate\Database\Console\Seeds\WithoutModelEvents; 
use Illuminate\Database\Seeder;
use App\Models\Category; // Pastikan path ke model Category Anda benar
use Illuminate\Support\Str; // Untuk membuat slug

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Teknologi', 'Gaya Hidup', 'Perjalanan', 'Kuliner', 'Olahraga',
            'Pendidikan', 'Bisnis', 'Seni & Budaya', 'Kesehatan', 'Opini',
            'Berita', 'Pengembangan Diri', 'Keuangan', 'Hobi', 'Otomotif',
            // Tambahan 10 kategori baru
            'Musik', 'Film', 'Sains', 'Lingkungan', 'Sejarah',
            'Fotografi', 'Gaming', 'Parenting', 'Resep', 'DIY & Kerajinan'
        ];

        // Loop melalui array nama kategori dan buat entri di database
        foreach ($categories as $categoryName) {
            Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName) // Membuat slug otomatis dari nama
            ]);
        }

        // Anda bisa menambahkan lebih banyak kategori di sini jika diperlukan
        // Contoh:
        // Category::create(['name' => 'Lingkungan Hidup', 'slug' => 'lingkungan-hidup']);

        // Untuk memberi tahu di console bahwa seeder berjalan (opsional)
        // $this->command->info('Category table seeded!');
    }
}
