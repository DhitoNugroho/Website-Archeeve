<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth; // Menggunakan fasad JWTAuth
use Tymon\JWTAuth\Exceptions\JWTException; // Untuk menangani exception dari JWTAuth

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     * Menerapkan middleware 'auth:api' ke semua method kecuali 'login' dan 'register'.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) { // Menggunakan guard 'api'
            return response()->json(['error' => 'Unauthorized', 'message' => 'Invalid credentials provided.'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a User.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6', // Membutuhkan field password_confirmation
            'role' => 'sometimes|string|in:user,admin', 
        ]);

        if($validator->fails()){
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $user = User::create(array_merge(
                    $validator->validated(),
                    [
                        'password' => bcrypt($request->password),
                        'role' => $request->input('role', 'user'), // Default role 'user' jika tidak diberikan
                    ]
                ));
        
        // Opsional: Langsung login user setelah registrasi dan kembalikan token
        // $token = auth('api')->login($user);
        // return $this->respondWithToken($token);

        return response()->json([
            'message' => 'User successfully registered. Please login.',
            'user' => $user
        ], 201);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            auth('api')->logout(); // Menggunakan guard 'api' untuk logout (invalidate token)
        } catch (JWTException $e) {
            // Jika ada error saat logout (misalnya token sudah tidak valid atau masalah lain)
            // Tetap kembalikan respons sukses karena tujuan logout di sisi klien tercapai
             return response()->json(['message' => 'Successfully logged out (server token issue ignored).'], 200);
        }
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            // Menggunakan fasad JWTAuth untuk refresh token
            $newToken = JWTAuth::parseToken()->refresh();
            return $this->respondWithToken($newToken);
        } catch (JWTException $e) {
            // Tangani berbagai jenis JWTException di sini jika perlu (TokenInvalidException, TokenBlacklistedException, dll.)
            return response()->json(['error' => 'could_not_refresh_token', 'message' => $e->getMessage()], ($e instanceof \Tymon\JWTAuth\Exceptions\TokenBlacklistedException ? 401 : 500) );
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile(Request $request)
    {
        // Mengambil user yang terautentikasi melalui guard 'api'
        $user = auth('api')->user();

        if (!$user) {
             // Ini seharusnya tidak terjadi jika middleware 'auth:api' bekerja dengan benar
             return response()->json(['message' => 'User not found or token invalid.'], 404);
        }
        
        // Kembalikan data user. Frontend Anda (AuthContext.js) mengharapkan 'data.data' atau 'data'
        // Mari kita konsisten dengan wrapper 'data'
        return response()->json(['data' => $user]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // Menggunakan fasad JWTAuth untuk mendapatkan TTL
            'user' => auth('api')->user() // Mengembalikan data user juga
        ]);
    }
}