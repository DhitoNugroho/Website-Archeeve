<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show', 'getArticlesByTagSlug']]);
        $this->middleware('role:admin', ['only' => ['store', 'update', 'destroy']]); // Hanya admin yang bisa CRUD
    }

    public function index()
    {
        $tags = Tag::latest()->get();
        return response()->json($tags);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:tags,name|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($tag, 201);
    }

    public function show($id)
    {
        $tag = Tag::find($id);
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        return response()->json($tag);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::find($id);
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:tags,name,' . $tag->id . '|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tag->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($tag);
    }

    public function destroy($id)
    {
        $tag = Tag::find($id);
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        $tag->delete();
        return response()->json(['message' => 'Tag deleted successfully']);
    }

    public function getArticlesByTagSlug($slug)
    {
        $tag = Tag::where('slug', $slug)->first();
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }

        $articles = $tag->articles()->where('status', 'published')->with(['user', 'category'])->latest()->paginate(10);
        return response()->json($articles);
    }
}