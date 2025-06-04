// src/pages/admin/CommentModerationPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Sesuaikan path jika perlu

// Ikon dari Heroicons
import {
  ChatBubbleLeftEllipsisIcon, // Untuk judul halaman
  CheckCircleIcon,
  TrashIcon,
  UserCircleIcon, // Untuk avatar placeholder
  DocumentTextIcon, // Untuk link artikel
  ClockIcon, // Untuk tanggal
} from '@heroicons/react/24/outline';

const CommentModerationPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({ id: null, type: '' }); // Untuk loading per aksi

  // State untuk Paginasi (jika diperlukan di masa depan)
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [perPage, setPerPage] = useState(10);

  const fetchCommentsToModerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Asumsi endpoint API Anda untuk mengambil komentar yang belum diapprove (pending)
      // atau semua komentar dengan filter status
      const response = await api.get('/admin/comments?status=pending'); // Atau '/admin/comments' jika Anda filter di frontend
      setComments(response.data.data || response.data || []); // Sesuaikan dengan struktur API Anda
      // Setup paginasi jika API mendukungnya
      // setTotalPages(response.data.last_page || 1);
      // setCurrentPage(response.data.current_page || 1);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
      console.error("Error fetching comments:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  }, []); // Tambahkan dependensi jika ada (misalnya, currentPage, perPage)

  useEffect(() => {
    fetchCommentsToModerate();
  }, [fetchCommentsToModerate]);

  const handleApproveComment = async (commentId) => {
    setActionLoading({ id: commentId, type: 'approve' });
    try {
      await api.patch(`/admin/comments/${commentId}/approve`);
      // Hapus komentar dari daftar setelah diapprove atau fetch ulang
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      // Tampilkan pesan sukses jika perlu
    } catch (err) {
      setError(`Failed to approve comment ${commentId}.`);
      console.error("Error approving comment:", err);
    } finally {
      setActionLoading({ id: null, type: '' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm(`Are you sure you want to delete this comment? This action cannot be undone.`)) {
      setActionLoading({ id: commentId, type: 'delete' });
      try {
        await api.delete(`/admin/comments/${commentId}`);
        // Hapus komentar dari daftar
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      } catch (err) {
        setError(`Failed to delete comment ${commentId}.`);
        console.error("Error deleting comment:", err);
      } finally {
        setActionLoading({ id: null, type: '' });
      }
    }
  };
  
  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading Comments for Moderation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center space-x-3">
        <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-yellow-500" /> {/* Ganti warna tema */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Comment Moderation</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {comments.length === 0 && !loading ? (
        <div className="text-center py-16 bg-white shadow-lg rounded-xl border border-gray-200">
          <ChatBubbleLeftEllipsisIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">All Clear!</h3>
          <p className="mt-1 text-base text-gray-500">
            There are no comments currently awaiting moderation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            let authorProfileImageUrl = '';
            // Asumsi 'comment.user.profile_image_url' jika komentar dari user terdaftar
            // atau 'comment.author_avatar_url' jika dari guest dengan avatar (misalnya Gravatar)
            const potentialImageUrl = comment.user?.profile_image_url || comment.author_avatar_url;
            if (potentialImageUrl) {
                if (potentialImageUrl.startsWith('http')) {
                    authorProfileImageUrl = potentialImageUrl;
                } else {
                    authorProfileImageUrl = `${LARAVEL_API_URL.replace(/\/+$/, '')}/${potentialImageUrl.replace(/^\/+/, '')}`;
                }
            }

            return (
              <div key={comment.id} className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {authorProfileImageUrl ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={authorProfileImageUrl} alt={comment.user?.name || comment.guest_name || 'Author'} />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <p className="text-sm font-semibold text-yellow-600 truncate"> {/* Ganti warna tema */}
                          {comment.user?.name || comment.guest_name || 'Anonymous'}
                          {comment.user?.email && <span className="text-xs text-gray-500 ml-2 font-normal">({comment.user.email})</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-0 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(comment.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {comment.article && (
                        <p className="mt-1 text-xs text-gray-500">
                          Commented on: <Link to={`/articles/${comment.article.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{comment.article.title}</Link>
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                <div className="bg-gray-50 px-5 py-3 sm:px-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => handleApproveComment(comment.id)}
                    disabled={actionLoading.id === comment.id && actionLoading.type === 'approve'}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {actionLoading.id === comment.id && actionLoading.type === 'approve' ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={actionLoading.id === comment.id && actionLoading.type === 'delete'}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed" // Ganti warna tema focus
                  >
                     {actionLoading.id === comment.id && actionLoading.type === 'delete' ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                     <TrashIcon className="-ml-1 mr-2 h-5 w-5 text-red-500" aria-hidden="true" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Tambahkan Paginasi di sini jika API Anda mendukung dan ada banyak komentar */}
    </div>
  );
};

export default CommentModerationPage;
