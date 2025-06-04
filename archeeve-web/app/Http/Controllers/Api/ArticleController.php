<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Tag; // Import Tag model
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class ArticleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'searchArticles']]);
    }

    // --- PUBLIC METHODS ---

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $articles = Article::with(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate($perPage);
        return response()->json($articles);
    }

    public function show($slug)
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'published')
            ->with(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug', 'comments' => function ($query) {
                $query->where('approved', true)->with('user:id,name')->orderBy('created_at', 'desc');
            }])
            ->first();

        if (!$article) {
            return response()->json(['message' => 'Article not found or not published'], 404);
        }
        $article->increment('views_count');
        return response()->json($article);
    }

    public function searchArticles(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keyword' => 'required|string|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }
        $keyword = $request->query('keyword');
        $perPage = $request->query('per_page', 10);

        $articles = Article::where('status', 'published')
            ->where(function ($query) use ($keyword) {
                $query->where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('content', 'like', '%' . $keyword . '%');
            })
            ->with(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug'])
            ->latest('published_at')
            ->paginate($perPage);
        return response()->json($articles);
    }

    // --- AUTHENTICATED METHODS (FOR USER/ADMIN) ---

    public function getArticleForEdit($id)
    {
        $article = Article::with(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug'])->find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->id !== $article->user_id && $user->role !== 'admin') {
            return response()->json(['message' => 'You are not authorized to edit this article.'], 403);
        }

        if ($article->image && !Str::startsWith($article->image, ['http://', 'https://'])) {
            $article->image_url = Storage::url($article->image);
        } else {
            $article->image_url = $article->image;
        }

        return response()->json($article);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|unique:articles,title|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array', // Menerima array
            'tags.*' => 'nullable|string|max:100', // Setiap item tag adalah string, max 100 char
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $imagePublicUrl = null;
        if ($request->hasFile('image')) {
            $relativePath = $request->file('image')->store('articles_images', 'public');
            $imagePublicUrl = Storage::url($relativePath);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $article = $user->articles()->create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'content' => $request->content,
            'category_id' => $request->category_id,
            'image' => $imagePublicUrl,
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? now() : null,
        ]);

        // Proses Tags
        if ($request->has('tags')) {
            $tagIds = [];
            $submittedTagNames = $request->input('tags', []);

            if (!is_array($submittedTagNames)) {
                $submittedTagNames = [];
            }
            
            // Filter out empty strings that might come from formData.append('tags[]', '')
            $submittedTagNames = array_filter(array_map('trim', $submittedTagNames), function($name) {
                return !empty($name);
            });

            foreach ($submittedTagNames as $tagName) {
                if (empty($tagName)) continue; // Lewati jika nama tag kosong setelah trim

                $tag = Tag::firstOrCreate(
                    ['name' => $tagName], // Cari berdasarkan nama
                    ['slug' => Str::slug($tagName)] // Buat slug jika tag baru
                );
                $tagIds[] = $tag->id;
            }
            if (!empty($tagIds)) {
                $article->tags()->sync($tagIds);
            } else {
                $article->tags()->detach(); // Hapus semua tag jika array tag kosong
            }
        }


        return response()->json($article->load(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug']), 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        /** @var \App\Models\User $loggedInUser */
        $loggedInUser = Auth::user();

        if ($loggedInUser->id !== $article->user_id && $loggedInUser->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized to update this article'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:articles,title,' . $article->id,
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array', // Menerima array
            'tags.*' => 'nullable|string|max:100', // Setiap item tag adalah string
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'status' => 'required|in:draft,published,archived',
            'clear_image' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $dataToUpdate = $request->except(['image', 'tags', '_method', 'clear_image']);

        if ($request->has('title') && $article->title !== $request->title) {
            $dataToUpdate['slug'] = Str::slug($request->title) . '-' . $article->id; // Update slug agar unik dengan ID
        }

        if ($request->hasFile('image')) {
            if ($article->image) {
                $oldImagePathRelative = Str::replaceFirst(Storage::url(''), '', $article->image);
                if (Storage::disk('public')->exists($oldImagePathRelative)) {
                    Storage::disk('public')->delete($oldImagePathRelative);
                }
            }
            $newImagePath = $request->file('image')->store('articles_images', 'public');
            $dataToUpdate['image'] = Storage::url($newImagePath);
        } elseif ($request->input('clear_image') == '1' || $request->input('clear_image') === true) {
            if ($article->image) {
                $oldImagePathRelative = Str::replaceFirst(Storage::url(''), '', $article->image);
                if (Storage::disk('public')->exists($oldImagePathRelative)) {
                    Storage::disk('public')->delete($oldImagePathRelative);
                }
            }
            $dataToUpdate['image'] = null;
        }

        if ($request->status === 'published' && $article->status !== 'published') {
            $dataToUpdate['published_at'] = now();
        } elseif ($request->status !== 'published' && $article->published_at !== null) {
            // Jika status diubah dari published ke draft/archived, null-kan published_at
            // dataToUpdate['published_at'] = null; // Opsional, tergantung kebutuhan
        }


        $article->update($dataToUpdate);

        // Proses Tags untuk update
        if ($request->has('tags')) { // Periksa apakah field 'tags' dikirim
            $tagIds = [];
            $submittedTagNames = $request->input('tags', []);

            if (!is_array($submittedTagNames)) {
                $submittedTagNames = [];
            }
            
            // Filter out empty strings
            $submittedTagNames = array_filter(array_map('trim', $submittedTagNames), function($name) {
                return !empty($name);
            });

            foreach ($submittedTagNames as $tagName) {
                if (empty($tagName)) continue;

                $tag = Tag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            // Sync akan menghapus tag yang tidak ada di $tagIds dan menambahkan yang baru
            $article->tags()->sync($tagIds); 
        }
        // Jika $request->has('tags') adalah false, maka tag tidak diubah.
        // Jika Anda ingin agar tidak mengirim field 'tags' berarti "jangan ubah tag",
        // dan mengirim 'tags' (meskipun array kosong) berarti "hapus semua tag", maka logika ini sudah benar.

        return response()->json($article->load(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug']));
    }

    public function destroy($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        /** @var \App\Models\User $loggedInUser */
        $loggedInUser = Auth::user();

        if ($loggedInUser->id !== $article->user_id && $loggedInUser->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized to delete this article'], 403);
        }

        if ($article->image) {
            $relativePath = Str::replaceFirst(Storage::url(''), '', $article->image);
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }
        $article->tags()->detach();
        $article->delete();
        return response()->json(['message' => 'Article deleted successfully']);
    }

    public function allArticlesForAdmin(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $articles = Article::with(['user:id,name', 'category:id,name,slug', 'tags:id,name,slug'])
            ->latest()
            ->paginate($perPage);
        return response()->json($articles);
    }
}