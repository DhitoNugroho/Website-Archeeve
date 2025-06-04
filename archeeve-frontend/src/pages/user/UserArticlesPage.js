// src/pages/user/UserArticlesPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path jika perlu
import api from '../../services/api'; // Sesuaikan path jika perlu
import ArticleCard from '../../components/ArticleCard'; // Sesuaikan path jika perlu

// Contoh ikon dari Heroicons
import { UserCircleIcon, PencilSquareIcon, BookOpenIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const UserArticlesPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ articlesCount: 0 /*, followers: 0, following: 0 */ }); // Tambahkan stats lain jika ada

  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  const fetchUserArticles = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setError("User not found. Please log in.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Mengambil artikel milik pengguna
      // Endpoint ini dari UserProfileController Anda: public function userArticles()
      const response = await api.get('/user/articles'); // Asumsi endpoint ini mengembalikan artikel user yang login
      setArticles(response.data.data || response.data || []); // Sesuaikan dengan struktur data API Anda
      setUserStats(prevStats => ({ ...prevStats, articlesCount: response.data.total || (response.data.data || response.data || []).length }));
    } catch (err) {
      setError('Failed to load your articles.');
      console.error("Error fetching user articles:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserArticles();
  }, [fetchUserArticles]);

  let profileImageUrl = '';
  if (user?.profile_image_url) {
    if (user.profile_image_url.startsWith('http')) {
      profileImageUrl = user.profile_image_url;
    } else {
      profileImageUrl = `${LARAVEL_API_URL.replace(/\/+$/, '')}/${user.profile_image_url.replace(/^\/+/, '')}`;
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading Your Profile & Articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 font-sans">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
          <p>{error}</p>
          <Link to="/dashboard" className="mt-4 inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"> {/* Ganti bg-yellow-500/600 */}
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    // Ini seharusnya tidak terjadi jika rute ini adalah PrivateRoute, tapi sebagai fallback
    return (
        <div className="text-center py-10 font-sans">
            <p className="text-xl text-gray-600">Please log in to see your articles.</p>
            <Link to="/login" className="mt-4 inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"> {/* Ganti bg-yellow-500/600 */}
                Login
            </Link>
        </div>
    );
  }

  return (
    // Padding halaman sudah diatur oleh <main> di App.js
    // font-sans juga seharusnya sudah diatur di App.js atau body
    <div className="space-y-8 md:space-y-10">
      {/* Bagian Header Profil */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Foto Profil */}
          <div className="flex-shrink-0">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={user.name || 'User profile'}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover shadow-md border-2 border-yellow-400" // Ganti border-yellow-400
              />
            ) : (
              <UserCircleIcon className="h-24 w-24 md:h-32 md:w-32 text-gray-300" />
            )}
          </div>

          {/* Informasi Profil */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {user.name || 'Your Name'}
            </h1>
            {/* Tambahkan username/handle jika ada */}
            {/* <p className="text-gray-500 text-sm">@{user.username || 'username'}</p> */}
            
            {/* Bio Pengguna */}
            <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl">
              {user.bio || 'No bio provided. You can add one in your profile settings.'}
            </p>

            {/* Statistik (Contoh) */}
            <div className="mt-4 flex justify-center sm:justify-start space-x-4 md:space-x-6 text-sm">
              <div>
                <span className="font-semibold text-gray-800">{userStats.articlesCount}</span>
                <span className="text-gray-500 ml-1">Articles</span>
              </div>
              {/* <div>
                <span className="font-semibold text-gray-800">{userStats.followers}</span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-800">{userStats.following}</span>
                <span className="text-gray-500 ml-1">Following</span>
              </div> */}
            </div>

            {/* Tombol Aksi Profil */}
            <div className="mt-4 flex justify-center sm:justify-start space-x-3">
              <Link
                to="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-yellow-500 text-sm font-medium rounded-md text-yellow-600 bg-white hover:bg-yellow-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400" // Ganti warna tema
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </Link>
              <Link
                to="/articles/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors" // Ganti warna tema
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                New Article
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Judul Bagian Artikel */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">Your Articles</h2>
        {/* Tambahkan filter atau tombol sorting jika perlu di masa depan */}
      </div>

      {/* Grid Artikel Pengguna */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">No Articles Yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't published any articles. Start creating!
          </p>
          <div className="mt-6">
            <Link
              to="/articles/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors" // Ganti warna tema
            >
              Create Your First Article
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserArticlesPage;
