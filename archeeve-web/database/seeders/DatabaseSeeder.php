<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class, // Isi seeder ini
            TagSeeder::class,      // Isi seeder ini
            ArticleSeeder::class,  // Isi seeder ini
            CommentSeeder::class,  // Isi seeder ini
        ]);
    }
}