<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category; 
use Illuminate\Support\Str; 

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

        
    }
}
