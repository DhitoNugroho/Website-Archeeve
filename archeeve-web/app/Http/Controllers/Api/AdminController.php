<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('role:admin'); // Middleware untuk memastikan hanya admin
    }

    // Dashboard Admin & Statistik
    public function dashboardStats()
    {
        $totalUsers = User::count();
        $totalArticles = Article::count();
        $publishedArticles = Article::where('status', 'published')->count();
        $pendingComments = Comment::where('approved', false)->count();
        $mostViewedArticles = Article::orderByDesc('views_count')->take(5)->get(['title', 'slug', 'views_count']);

        return response()->json([
            'total_users' => $totalUsers,
            'total_articles' => $totalArticles,
            'published_articles' => $publishedArticles,
            'pending_comments' => $pendingComments,
            'most_viewed_articles' => $mostViewedArticles,
        ]);
    }

    // CRUD User
    public function getUsers()
    {
        $users = User::paginate(10);
        return response()->json($users);
    }

    public function getUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
            'role' => 'required|in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => bcrypt($request->password)]
        ));

        return response()->json($user, 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => ['required', 'string', 'email', 'max:100', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|confirmed|min:6', // Password opsional saat update
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return response()->json($user);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        if ($user->id === auth()->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Pengaturan Website 
    public function getSettings()
    {
        return response()->json([
            'site_title' => env('APP_NAME', 'Archoose CMS'),
            'site_logo_url' => '/storage/site_logo.png', 
            'seo_description' => 'A modern CMS for articles',
            'seo_keywords' => 'cms, articles, blog, laravel, react',
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'site_title' => 'nullable|string|max:255',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'seo_description' => 'nullable|string|max:500',
            'seo_keywords' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }


        if ($request->hasFile('site_logo')) {
            
            $path = $request->file('site_logo')->storeAs('public', 'site_logo.png');
            
        }

        return response()->json(['message' => 'Website settings updated successfully']);
    }
}