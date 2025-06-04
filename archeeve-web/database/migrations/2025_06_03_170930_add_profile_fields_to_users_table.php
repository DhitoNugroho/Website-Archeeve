<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('email'); // Atau sesuaikan posisi 'after'
            $table->string('profile_image_path')->nullable()->after('bio'); // Menyimpan path relatif ke file gambar
            $table->string('profile_image_url')->nullable()->after('profile_image_path'); // Menyimpan URL lengkap jika diperlukan, atau bisa jadi accessor
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'profile_image_path', 'profile_image_url']);
        });
    }
};