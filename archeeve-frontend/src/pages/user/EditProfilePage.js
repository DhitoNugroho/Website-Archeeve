// src/pages/user/EditProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path
import api from '../../services/api'; // Sesuaikan path
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Contoh ikon

const EditProfilePage = () => {
  const { user, setUser } = useAuth(); // Asumsi setUser dari AuthContext bisa update user global

  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Email mungkin tidak bisa diedit, tergantung kebijakan Anda
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // Untuk file baru
  const [profilePicturePreview, setProfilePicturePreview] = useState(''); // Untuk preview gambar baru
  const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState(''); // URL gambar saat ini

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || ''); // Asumsi ada field 'bio' di data user

      // Mengatur URL gambar profil saat ini
      // Asumsi user.profile_image_url adalah path lengkap atau relatif dari API
      if (user.profile_image_url) {
        if (user.profile_image_url.startsWith('http')) {
          setCurrentProfilePictureUrl(user.profile_image_url);
        } else {
          // Tambahkan base URL jika path relatif
          setCurrentProfilePictureUrl(`${LARAVEL_API_URL.replace(/\/+$/, '')}/${user.profile_image_url.replace(/^\/+/, '')}`);
        }
      } else {
        setCurrentProfilePictureUrl(''); // Atau set ke placeholder default
      }
      setProfilePicturePreview(''); // Reset preview saat user data berubah
      setProfilePicture(null);      // Reset file input saat user data berubah
    }
  }, [user, LARAVEL_API_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
      setSuccess(''); // Hapus pesan sukses jika ada
      setError('');   // Hapus pesan error jika ada
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    // formData.append('email', email); // Biasanya email tidak diubah atau ada proses verifikasi khusus
    if (bio) { // Kirim bio hanya jika ada isinya atau selalu kirim
        formData.append('bio', bio);
    }
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }
    formData.append('_method', 'PUT'); // Jika API Anda menggunakan method spoofing untuk PUT via POST

    try {
      // Ganti dengan endpoint API update profil Anda
      // API mungkin mengembalikan data user yang sudah terupdate
      const response = await api.post('/user/profile', formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setLoading(false);
      setSuccess('Profile updated successfully!');
      
      // Update user data di AuthContext jika API mengembalikan data user baru
      if (response.data && response.data.user) {
         setUser(response.data.user); // Asumsi setUser ada di AuthContext
         // Update currentProfilePictureUrl jika gambar berubah
         if (response.data.user.profile_image_url) {
            if (response.data.user.profile_image_url.startsWith('http')) {
                setCurrentProfilePictureUrl(response.data.user.profile_image_url);
            } else {
                setCurrentProfilePictureUrl(`${LARAVEL_API_URL.replace(/\/+$/, '')}/${response.data.user.profile_image_url.replace(/^\/+/, '')}`);
            }
         }
         setProfilePicture(null); // Reset file input
         setProfilePicturePreview(''); // Reset preview
      } else {
        // Jika API tidak mengembalikan user data lengkap, refetch atau update manual
        // Contoh sederhana:
        setUser(prevUser => ({...prevUser, name, bio}));
      }

    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        // Format validation errors (contoh sederhana)
        const messages = Object.values(validationErrors).flat().join(' ');
        setError(messages || errorMsg);
      } else {
        setError(errorMsg);
      }
      console.error("Profile update error:", err.response || err);
    }
  };

  return (
    // Padding halaman sudah diatur oleh <main> di App.js
    // font-sans juga seharusnya sudah diatur di App.js atau body
    <div className="max-w-3xl mx-auto"> {/* Kontainer untuk membatasi lebar form */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{success}</p>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {profilePicturePreview ? (
              <img src={profilePicturePreview} alt="New profile preview" className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-yellow-400" />
            ) : currentProfilePictureUrl ? (
              <img src={currentProfilePictureUrl} alt="Current profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
            ) : (
              <UserCircleIcon className="w-32 h-32 text-gray-300" />
            )}
             <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md border-2 border-white transition-colors" // Ganti warna tema
                title="Change profile photo"
            >
                <PhotoIcon className="w-5 h-5" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden" // Input file disembunyikan, di-trigger oleh tombol
          />
           {profilePicture && <p className="text-xs text-gray-500 mt-1">{profilePicture.name}</p>}
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
          />
        </div>

        {/* Email Field (biasanya read-only atau tidak bisa diubah dari sini) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            readOnly // Atau disabled jika tidak ingin bisa disalin
            className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500 shadow-sm sm:text-sm p-3 cursor-not-allowed"
          />
           <p className="mt-1 text-xs text-gray-400">Email address cannot be changed from here.</p>
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            About Me / Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself..."
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'}
                        transition-colors duration-300`} // Ganti warna tema
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                </>
            ) : (
              'Update Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;