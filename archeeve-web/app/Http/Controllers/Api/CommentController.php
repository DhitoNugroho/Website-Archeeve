<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Article; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; 

class CommentController extends Controller
{
    public function __construct()
    {
        // Metode 'store' bisa diakses publik (baik oleh tamu maupun pengguna login via API token).
        // Metode lain seperti index, approve, destroy memerlukan autentikasi 'auth:api'.
        $this->middleware('auth:api', ['except' => ['store']]);
        // Metode index, approve, destroy juga memerlukan role 'admin'.
        $this->middleware('role:admin', ['only' => ['index', 'approve', 'destroy']]);
    }

    /**
     * Menyimpan komentar baru.
     * Dapat menangani komentar dari pengguna yang terautentikasi (via API token)
     * maupun dari pengguna tamu.
     */
    public function store(Request $request)
    {
        // 1. Coba dapatkan pengguna yang terautentikasi melalui guard 'api' (berdasarkan token)
        $authenticatedUser = Auth::guard('api')->user();

        // 2. Definisikan aturan validasi dasar
        $rules = [
            'article_id' => 'required|integer|exists:articles,id', // Pastikan tabel 'articles' dan kolom 'id' ada
            'content'    => 'required|string|min:1|max:5000', // Batasi panjang komentar
        ];

        // 3. Jika tidak ada pengguna yang terautentikasi (tamu),
        //    maka guest_name dan guest_email menjadi wajib.
        if (!$authenticatedUser) {
            $rules['guest_name']  = 'required|string|max:255';
            $rules['guest_email'] = 'required|email|max:255';
        } else {
            // Jika pengguna terautentikasi, guest_name dan guest_email bisa 'nullable'
            // Sebaiknya frontend tidak mengirim field ini jika user sudah login.
            // Namun, jika terkirim, validasi 'nullable' akan mengizinkannya jika kosong/null.
            $rules['guest_name'] = 'nullable|string|max:255';
            $rules['guest_email'] = 'nullable|email|max:255';
        }

        // 4. Lakukan validasi
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            // Kembalikan respons error validasi standar Laravel
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 5. Ambil data yang sudah divalidasi
        $validatedData = $validator->validated();

        // 6. Siapkan data untuk disimpan
        $commentData = [
            'article_id' => $validatedData['article_id'],
            'content'    => $validatedData['content'],
            'approved'   => false, // Komentar baru defaultnya menunggu moderasi
        ];

        if ($authenticatedUser) {
            // Jika pengguna terautentikasi, set user_id
            $commentData['user_id'] = $authenticatedUser->id;
            // Pastikan guest_name dan guest_email null untuk pengguna terautentikasi
            $commentData['guest_name'] = null;
            $commentData['guest_email'] = null;
        } else {
            // Jika tamu, guest_name dan guest_email diambil dari data yang divalidasi
            // (sudah dipastikan 'required' oleh aturan validasi di atas)
            $commentData['guest_name']  = $validatedData['guest_name'];
            $commentData['guest_email'] = $validatedData['guest_email'];
            $commentData['user_id']     = null;
        }

        // 7. Buat dan simpan komentar
        try {
            $comment = Comment::create($commentData);

            // Jika Anda ingin mengembalikan data user bersama komentar (opsional)
            if ($authenticatedUser && method_exists($comment, 'load')) {
                $comment->load('user'); // Asumsi ada relasi 'user' di model Comment
            }

            return response()->json([
                'message' => 'Comment submitted successfully. It will be visible after approval.',
                'comment' => $comment
            ], 201); // HTTP 201 Created

        } catch (\Exception $e) {
            Log::error('Error creating comment: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            return response()->json(['message' => 'Failed to submit comment due to a server error.'], 500);
        }
    }

    // Admin only: Get all comments for moderation
    public function index()
    {
        $comments = Comment::with(['article', 'user'])->latest()->paginate(10);
        return response()->json($comments);
    }

    // Admin only: Approve a comment
    public function approve($id) // Anda bisa menggunakan Route Model Binding: public function approve(Comment $comment)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->approved = true;
        $comment->save();

        return response()->json(['message' => 'Comment approved successfully', 'comment' => $comment]);
    }

    // Admin only: Delete a comment
    public function destroy($id) 
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
