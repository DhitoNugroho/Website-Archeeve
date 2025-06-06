<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Nullable jika komentar anonim
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->string('guest_name')->nullable(); 
            $table->string('guest_email')->nullable(); 
            $table->boolean('approved')->default(false); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
