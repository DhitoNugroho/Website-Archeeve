<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\AdminController;

// Auth Routes (Publicly Accessible)
// Grup untuk rute-rute terkait autentikasi.
Route::group([
    'middleware' => 'api', 
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    // Rute yang memerlukan autentikasi di dalam grup auth
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']); // Untuk refresh JWT token jika digunakan
        Route::get('user-profile', [AuthController::class, 'userProfile']); // Mengambil data user yang sedang login
    });
});

// User Profile Routes (Authenticated Users)
// Grup untuk rute terkait manajemen profil pengguna yang sudah login.
Route::group([
    'middleware' => ['auth:api'], // Memastikan hanya user terautentikasi yang bisa akses.
    'prefix' => 'user'
], function () {
    // Rute untuk update profil. 
    Route::put('profile', [UserProfileController::class, 'updateProfile']);
    
    // Rute untuk ganti password. 
    Route::put('change-password', [UserProfileController::class, 'changePassword']);
    
    Route::get('articles', [UserProfileController::class, 'userArticles']); // Menampilkan artikel yang ditulis oleh user yang sedang login.
});


// Public Routes for Articles, Categories, Tags
Route::get('articles', [ArticleController::class, 'index']); // Menampilkan semua artikel yang sudah publish.
Route::get('articles/search', [ArticleController::class, 'searchArticles']); // Rute untuk pencarian artikel.
Route::get('articles/{slug}', [ArticleController::class, 'show']); // Menampilkan detail satu artikel berdasarkan slug.

Route::get('categories', [CategoryController::class, 'index']); // Menampilkan daftar semua kategori.
Route::get('categories/{slug}/articles', [CategoryController::class, 'getArticlesByCategorySlug']); // Menampilkan artikel berdasarkan slug kategori.

Route::get('tags', [TagController::class, 'index']); // Menampilkan daftar semua tag.
Route::get('tags/{slug}/articles', [TagController::class, 'getArticlesByTagSlug']); // Menampilkan artikel berdasarkan slug tag.

// Rute untuk membuat komentar. Bisa diakses guest atau user login.
Route::post('comments', [CommentController::class, 'store']);


// Authenticated Routes (CRUD for logged-in users, terutama untuk artikel mereka)
Route::group(['middleware' => ['auth:api']], function () {
    // Article CRUD (User & Admin bisa mengelola artikel mereka sendiri)
    Route::post('articles', [ArticleController::class, 'store']); // Membuat artikel baru.
    
    // Rute untuk mengambil data artikel spesifik untuk form edit.
    Route::get('articles/{id}/edit', [ArticleController::class, 'getArticleForEdit']);
    
    Route::put('articles/{id}', [ArticleController::class, 'update']); // Update artikel.
    Route::delete('articles/{id}', [ArticleController::class, 'destroy']); // Hapus artikel.
});

// Admin Routes (Admin Only)
Route::group([
    'middleware' => ['auth:api', 'role:admin'], // Memastikan user terautentikasi DAN memiliki role 'admin'.
    'prefix' => 'admin'
], function () {
    Route::get('dashboard-stats', [AdminController::class, 'dashboardStats']);

    // User Management (CRUD untuk user oleh admin)
    Route::get('users', [AdminController::class, 'getUsers']);
    Route::get('users/{id}', [AdminController::class, 'getUser']);
    Route::post('users', [AdminController::class, 'createUser']);
    Route::put('users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('users/{id}', [AdminController::class, 'deleteUser']);

    // Article Management (Admin bisa melihat semua artikel, termasuk draft)
    Route::get('articles', [ArticleController::class, 'allArticlesForAdmin']);

    // Category Management (CRUD untuk kategori oleh admin)
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    // Tag Management (CRUD untuk tag oleh admin)
    Route::post('tags', [TagController::class, 'store']);
    Route::put('tags/{id}', [TagController::class, 'update']);
    Route::delete('tags/{id}', [TagController::class, 'destroy']);

    // Comment Moderation
    Route::get('comments', [CommentController::class, 'index']); // Menampilkan semua komentar untuk moderasi.
    Route::patch('comments/{id}/approve', [CommentController::class, 'approve']); // Approve komentar (PATCH karena update parsial).
    Route::delete('comments/{id}', [CommentController::class, 'destroy']); // Hapus komentar oleh admin.

    // Website Settings
    Route::get('settings', [AdminController::class, 'getSettings']);
    Route::post('settings', [AdminController::class, 'updateSettings']); // POST atau PUT bisa digunakan, POST sering untuk form settings kompleks.
});
