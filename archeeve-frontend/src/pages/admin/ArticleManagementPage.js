// src/pages/admin/ArticleManagementPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api'; // Sesuaikan path jika perlu

// Ikon dari Heroicons
import {
  ArchiveBoxIcon, // Untuk judul halaman
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon, // Untuk link view artikel
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon, // Untuk kategori/tag
  UserCircleIcon // Untuk avatar penulis
} from '@heroicons/react/24/outline';

const ArticleManagementPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'published', 'draft', 'archived', '' (all)
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const history = useHistory();

  const fetchArticles = useCallback(async (page = 1, search = '', status = '') => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint API Anda untuk mengambil semua artikel (admin view)
      // Tambahkan parameter search dan status jika ada
      const response = await api.get(`/admin/articles?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}&status=${status}`);
      setArticles(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalArticles(response.data.total || 0);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error("Error fetching articles:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    // fetchArticles(currentPage, searchTerm, statusFilter);
    // Debounce akan menangani fetch awal juga
  }, [currentPage]); // Dihapus searchTerm & statusFilter agar debounce yang handle

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat filter status berubah
    // fetchArticles(1, searchTerm, event.target.value); // Atau biarkan debounce yang handle
  };
  
  // Debounce untuk search dan filter
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== undefined || statusFilter !== undefined) {
        setCurrentPage(1);
        fetchArticles(1, searchTerm, statusFilter);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, fetchArticles]);


  const handleDeleteArticle = async (articleId, articleTitle) => {
    if (window.confirm(`Are you sure you want to delete article "${articleTitle}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/articles/${articleId}`); // Endpoint delete artikel
        fetchArticles(currentPage, searchTerm, statusFilter); // Re-fetch untuk update tabel
      } catch (err) {
        setError(`Failed to delete article "${articleTitle}".`);
        console.error("Error deleting article:", err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusLower = status ? status.toLowerCase() : '';
    if (statusLower === 'published') {
      return 'bg-green-100 text-green-700';
    } else if (statusLower === 'draft') {
      return 'bg-yellow-100 text-yellow-700'; // Menggunakan tema kuning untuk 'draft'
    } else if (statusLower === 'archived') {
      return 'bg-gray-100 text-gray-700';
    }
    return 'bg-blue-100 text-blue-700'; // Default atau status lain
  };

  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-5 bg-gray-200 rounded-full w-20"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <div className="inline-block h-5 w-5 bg-gray-200 rounded"></div>
        <div className="inline-block h-5 w-5 bg-gray-200 rounded"></div>
        <div className="inline-block h-5 w-5 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <ArchiveBoxIcon className="h-8 w-8 text-yellow-500 mr-3 hidden sm:block" /> {/* Ganti warna tema */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Article Management</h1>
        </div>
        <Link
          to="/articles/create" // Admin juga bisa membuat artikel dari sini
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors w-full sm:w-auto" // Ganti warna tema
        >
          <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
          Create New Article
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div className="md:col-span-2">
          <label htmlFor="search-articles" className="sr-only">Search Articles</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              name="search-articles"
              id="search-articles"
              className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2.5 border-gray-300 rounded-lg
                         leading-5 bg-white placeholder-gray-500 text-gray-900 shadow-sm
                         transition duration-150 ease-in-out sm:text-sm" // Ganti warna focus
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
          <select
            id="status-filter"
            name="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="focus:ring-yellow-500 focus:border-yellow-500 block w-full py-2.5 pl-3 pr-10 border-gray-300 rounded-lg
                       bg-white text-gray-900 shadow-sm sm:text-sm transition duration-150 ease-in-out" // Ganti warna focus
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50"> {/* Header tabel dengan warna tema soft */}
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Title</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Author</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Category</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Status</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Views</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Published</th> {/* Ganti warna tema */}
              <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-yellow-700 uppercase tracking-wider">Actions</th>{/* Ganti warna tema */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && articles.length === 0 ? (
                [...Array(perPage)].map((_, i) => <SkeletonRow key={`skeleton-${i}`} />)
            ) : !loading && articles.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic text-base">
                  {searchTerm || statusFilter ? `No articles found matching your criteria.` : "No articles found. Click 'Create New Article' to begin."}
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-yellow-50/60 transition-colors duration-150"> {/* Ganti hover:bg-yellow-50/60 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-yellow-600 hover:underline" title={article.title}> {/* Ganti warna tema */}
                      {article.title.length > 40 ? `${article.title.substring(0, 40)}...` : article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{article.user?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.category ? (
                      <Link to={`/categories/${article.category.slug}`} className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200`}>
                        {article.category.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(article.status)}`}>
                      {article.status ? article.status.charAt(0).toUpperCase() + article.status.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {article.views_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB') : 'Not Published'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/articles/${article.slug}`} // Link untuk melihat artikel
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-100 transition-all duration-150"
                      title="View Article"
                    >
                      <EyeIcon className="h-5 w-5 inline" />
                    </Link>
                    <Link
                      to={`/articles/edit/${article.id}`} // Path edit artikel
                      className="text-yellow-600 hover:text-yellow-700 p-1.5 rounded-md hover:bg-yellow-100 transition-all duration-150" // Ganti warna tema
                      title="Edit Article"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline" />
                    </Link>
                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="text-red-600 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-all duration-150"
                      title="Delete Article"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {loading && articles.length > 0 && (
                <tr><td colSpan="7" className="text-center py-4"><p className="text-sm text-gray-500">Loading more articles...</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      {!loading && totalArticles > 0 && totalPages > 1 && (
        <div className="py-4 flex items-center justify-between border-t border-gray-200 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * perPage, totalArticles)}</span> of{' '}
                <span className="font-medium">{totalArticles}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Anda bisa menambahkan logika untuk menampilkan nomor halaman di sini */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagementPage;
