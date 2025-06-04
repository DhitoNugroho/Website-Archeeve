<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // <-- PASTIKAN INI DI-IMPORT untuk file handling
use App\Models\User;
use App\Models\Article; // Diperlukan jika ada relasi 'articles' di model User yang di-load

class UserProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Validasi hanya field yang diharapkan bisa diubah dari form ini
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|between:2,100', // 'sometimes' berarti validasi hanya jika field ada
                                                                 // 'required' jika nama wajib dikirim meskipun tidak berubah
            'bio' => 'nullable|string|max:1000', // Validasi untuk bio
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048', // Validasi untuk gambar profil
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422); // Kembalikan errors dalam format yang lebih standar
        }

        // Update nama jika dikirim dalam request
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        // Update bio jika dikirim dalam request (termasuk jika dikirim sebagai string kosong untuk menghapus bio)
        if ($request->exists('bio')) { // 'exists' lebih baik untuk field yang bisa jadi string kosong atau null
            $user->bio = $request->input('bio');
        }

        if ($request->hasFile('profile_picture')) {
            // Hapus gambar profil lama jika ada dan bukan URL eksternal
            // Asumsi: Anda menyimpan path relatif di DB (misal di kolom 'profile_image_path')
            // dan 'profile_image_url' adalah accessor atau juga disimpan.
            // Untuk kemudahan, kita asumsikan 'profile_image_path' menyimpan path di disk 'public'.
            if ($user->profile_image_path && Storage::disk('public')->exists($user->profile_image_path)) {
                Storage::disk('public')->delete($user->profile_image_path);
            }

            // Simpan gambar baru
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_image_path = $path; // Simpan path relatif untuk manajemen file
            $user->profile_image_url = Storage::url($path); // Simpan URL publik untuk ditampilkan
        }

        $user->save();
        $user->refresh(); // Refresh model untuk mendapatkan data terbaru (termasuk URL gambar)

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user // Kembalikan data user yang sudah terupdate
        ]);
    }

    public function changePassword(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string', // Min:6 bisa dihilangkan jika tidak ingin terlalu ketat di sini
            'new_password' => 'required|string|confirmed|min:8', // Min:8 adalah praktik yang baik
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            // Mengembalikan error dalam format yang sama dengan validator untuk konsistensi
            return response()->json(['errors' => ['current_password' => ['Current password does not match.']]], 422);
        }

        $user->password = Hash::make($request->new_password); // Gunakan Hash::make()
        $user->save();

        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function userArticles()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        // Eager load relasi untuk performa yang lebih baik
        $articles = $user->articles()->with(['category:id,name,slug', 'tags:id,name,slug'])->latest()->paginate(10);
        return response()->json($articles);
    }
}
