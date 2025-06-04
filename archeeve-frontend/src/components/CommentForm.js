// src/components/CommentForm.js
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ articleId, onCommentSubmitted }) => {
  const { isAuthenticated, user } = useAuth(); // Mengambil status autentikasi dan data pengguna
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const commentData = {
      article_id: articleId,
      content,
    };

    // Logika untuk pengguna tamu (tidak terautentikasi)
    if (!isAuthenticated) {
      // Validasi sisi klien: jika nama tamu atau email tamu kosong
      if (!guestName.trim() || !guestEmail.trim()) { // Tambahkan .trim() untuk menghindari spasi kosong
        // Pesan error ini SESUAI dengan yang Anda lihat di screenshot.
        // Ini berarti kondisi !isAuthenticated adalah true, dan salah satu field tamu kosong.
        setError('Guest name and email are required for unauthenticated comments.');
        setLoading(false);
        return; // Hentikan pengiriman
      }
      // Jika validasi sisi klien lolos, tambahkan nama dan email tamu ke data
      commentData.guest_name = guestName.trim();
      commentData.guest_email = guestEmail.trim();
    }
    // Jika pengguna terautentikasi, backend akan mengambil user_id dari token/sesi.

    try {
      // Kirim data komentar ke backend
      const response = await api.post('/comments', commentData); // Endpoint API Anda
      
      // Gunakan pesan dari backend jika ada, atau pesan default
      setSuccess(response.data.message || 'Comment submitted successfully! It may be awaiting moderation.');
      
      // Reset form fields
      setContent('');
      setGuestName('');
      setGuestEmail('');
      
      if (onCommentSubmitted) {
          // Update UI secara optimis (langsung tampilkan komentar baru)
          // Backend akan memberikan ID asli dan status 'approved' yang sebenarnya.
          onCommentSubmitted({
            id: Date.now(), // ID sementara untuk React key, akan diganti saat data asli dari backend diterima
            user_id: user?.id || null,
            // Untuk tampilan nama, gunakan guestName jika tidak terautentikasi
            user: isAuthenticated ? user : { name: guestName.trim() || 'Anonymous' },
            guest_name: isAuthenticated ? null : guestName.trim(), // Hanya isi guest_name jika tidak terautentikasi
            content: content,
            created_at: new Date().toISOString(),
            approved: false, // Asumsikan komentar baru menunggu moderasi
            // Anda mungkin perlu menyertakan field lain yang dikembalikan API dan dibutuhkan komponen parent
          });
      }
    } catch (err) {
      // Tangani error dari backend dengan lebih baik
      let errorMessage = 'Failed to submit comment. Please try again.'; // Pesan default
      if (err.response) {
        console.error("Backend Error Response:", err.response); // Log detail error dari backend
        // Jika ada respons error dari server (misalnya, error validasi 422)
        if (err.response.data) {
          if (err.response.data.errors) {
            // Jika Laravel mengirimkan objek 'errors' (umum untuk validasi 422)
            errorMessage = Object.values(err.response.data.errors).flat().join(' ');
          } else if (err.response.data.message) {
            // Jika server mengirimkan properti 'message'
            errorMessage = err.response.data.message;
          }
        }
      } else {
        console.error("Network/Request Error:", err.message); // Untuk error jaringan atau lainnya
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Form render
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave a Comment</h3>
      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}
      {/* Tampilkan pesan sukses jika ada */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate> {/* noValidate agar validasi HTML5 tidak mengganggu validasi JS Anda */}
        {/* Bagian ini akan muncul jika pengguna TIDAK terautentikasi */}
        {/* PASTIKAN field ini benar-benar muncul di browser Anda saat tidak login */}
        {!isAuthenticated && (
          <>
            <div className="mb-4">
              <label htmlFor="guestName" className="block text-gray-700 text-sm font-bold mb-2">Your Name:</label>
              <input
                type="text"
                id="guestName"
                name="guestName" // Tambahkan atribut name untuk aksesibilitas
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                // Atribut 'required' HTML5 bisa dihilangkan karena Anda sudah validasi di JS
              />
            </div>
            <div className="mb-4">
              <label htmlFor="guestEmail" className="block text-gray-700 text-sm font-bold mb-2">Your Email:</label>
              <input
                type="email"
                id="guestEmail"
                name="guestEmail" // Tambahkan atribut name
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          </>
        )}
        {/* Field untuk konten komentar */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
          <textarea
            id="content"
            name="content" // Tambahkan atribut name
            rows="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required // Konten komentar selalu wajib, jadi biarkan 'required' HTML5 di sini
          ></textarea>
        </div>
        {/* Tombol submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;