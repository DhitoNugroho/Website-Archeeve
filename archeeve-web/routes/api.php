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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth Routes (Publicly Accessible)
// Grup untuk rute-rute terkait autentikasi.
Route::group([
    'middleware' => 'api', // Middleware 'api' biasanya sudah diterapkan secara global untuk file ini oleh RouteServiceProvider.
                           // Menyatakannya secara eksplisit di sini tidak masalah, tapi bisa juga dihilangkan jika sudah global.
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
    // Rute untuk update profil. Menggunakan PUT karena ini adalah update resource.
    // Frontend mengirim FormData dengan _method:PUT, yang akan dihandle Laravel.
    Route::put('profile', [UserProfileController::class, 'updateProfile']);
    
    // Rute untuk ganti password. Menggunakan PUT.
    // Frontend harus mengirim request dengan method PUT.
    Route::put('change-password', [UserProfileController::class, 'changePassword']);
    
    Route::get('articles', [UserProfileController::class, 'userArticles']); // Menampilkan artikel yang ditulis oleh user yang sedang login.
});


// Public Routes for Articles, Categories, Tags
// Rute-rute ini umumnya bisa diakses publik untuk menampilkan konten.
// Middleware 'api' (throttling, dll.) sudah diterapkan secara global oleh RouteServiceProvider.
Route::get('articles', [ArticleController::class, 'index']); // Menampilkan semua artikel yang sudah publish (dengan paginasi).
Route::get('articles/search', [ArticleController::class, 'searchArticles']); // Rute untuk pencarian artikel.
Route::get('articles/{slug}', [ArticleController::class, 'show']); // Menampilkan detail satu artikel berdasarkan slug.

Route::get('categories', [CategoryController::class, 'index']); // Menampilkan daftar semua kategori.
Route::get('categories/{slug}/articles', [CategoryController::class, 'getArticlesByCategorySlug']); // Menampilkan artikel berdasarkan slug kategori.

Route::get('tags', [TagController::class, 'index']); // Menampilkan daftar semua tag.
Route::get('tags/{slug}/articles', [TagController::class, 'getArticlesByTagSlug']); // Menampilkan artikel berdasarkan slug tag.

// Rute untuk membuat komentar. Bisa diakses guest atau user login, tergantung implementasi controller.
Route::post('comments', [CommentController::class, 'store']);


// Authenticated Routes (CRUD for logged-in users, terutama untuk artikel mereka)
Route::group(['middleware' => ['auth:api']], function () {
    // Article CRUD (User & Admin bisa mengelola artikel mereka sendiri)
    Route::post('articles', [ArticleController::class, 'store']); // Membuat artikel baru.
    
    // Rute untuk mengambil data artikel spesifik untuk form edit.
    // Menggunakan {id} karena ini mungkin lebih mudah untuk otorisasi pemilik artikel.
    Route::get('articles/{id}/edit', [ArticleController::class, 'getArticleForEdit']);
    
    Route::put('articles/{id}', [ArticleController::class, 'update']); // Update artikel.
    Route::delete('articles/{id}', [ArticleController::class, 'destroy']); // Hapus artikel.
});

// Admin Routes (Admin Only)
// Grup untuk rute yang hanya bisa diakses oleh admin.
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
