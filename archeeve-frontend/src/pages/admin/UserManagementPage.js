// src/pages/admin/UserManagementPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api'; // Sesuaikan path jika perlu

// Ikon dari Heroicons
import {
  UsersIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const history = useHistory();

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    console.log(`Fetching users: page=${page}, search='${search}', per_page=${perPage}`);
    try {
      const response = await api.get(`/admin/users?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
      setUsers(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setCurrentPage(response.data.current_page || 1);
      setTotalUsers(response.data.total || 0);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error("Error fetching users:", err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  }, [perPage]); // perPage adalah dependensi stabil jika tidak diubah oleh user

  // useEffect untuk fetch data ketika currentPage atau fetchUsers (jika perPage berubah) berubah.
  // searchTerm tidak dimasukkan di sini karena akan ditangani oleh useEffect debounce di bawah.
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, fetchUsers]); // Hanya re-fetch jika currentPage atau fetchUsers (karena perPage) berubah. SearchTerm dihandle terpisah.

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // useEffect dengan debounce untuk pencarian
   useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Hanya fetch jika searchTerm sudah terdefinisi (menghindari fetch saat mount awal jika tidak ada search)
      // atau jika searchTerm adalah string kosong (untuk mereset filter)
      if (searchTerm !== undefined) { 
        console.log(`Debounced search for: '${searchTerm}'`);
        setCurrentPage(1); // Selalu reset ke halaman 1 saat search term berubah
        // fetchUsers akan dipanggil oleh useEffect [currentPage, fetchUsers] karena setCurrentPage(1)
        // Namun, untuk memastikan search term terbaru digunakan, kita panggil langsung juga.
        // Ini akan menyebabkan fetchUsers dipanggil dua kali jika currentPage juga berubah dari nilai selain 1.
        // Solusi yang lebih baik adalah membiarkan useEffect [currentPage] yang menangani,
        // tapi pastikan ia mendapatkan searchTerm terbaru.
        // Untuk sekarang, kita panggil langsung untuk memastikan.
        fetchUsers(1, searchTerm); 
      }
    }, 700); // 700ms delay debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]); // fetchUsers dimasukkan sebagai dependensi


  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        // Setelah delete, fetch ulang data untuk halaman saat ini
        // Jika item terakhir di halaman dihapus dan bukan halaman pertama, coba pindah ke halaman sebelumnya
        if (users.length === 1 && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1); // Ini akan memicu useEffect untuk fetchUsers
        } else {
            fetchUsers(currentPage, searchTerm); // Re-fetch halaman saat ini
        }
      } catch (err) {
        setError(`Failed to delete user ${userName}.`);
        console.error("Error deleting user:", err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage); // Ini akan memicu useEffect [currentPage, fetchUsers]
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleLower = role ? role.toLowerCase() : '';
    if (roleLower === 'admin') {
      return 'bg-red-100 text-red-700';
    } else if (roleLower === 'user') {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-gray-100 text-gray-700';
  };
  
  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div><div className="ml-4"><div className="h-4 bg-gray-200 rounded w-24"></div></div></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-5 bg-gray-200 rounded-full w-16"></div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2"><div className="inline-block h-5 w-5 bg-gray-200 rounded"></div><div className="inline-block h-5 w-5 bg-gray-200 rounded"></div></td>
    </tr>
  );

  // Fungsi untuk membuat tombol-tombol paginasi
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisibleButtons = 5; // Jumlah maksimal tombol halaman yang terlihat (tidak termasuk prev/next)
    let startPage, endPage;

    if (totalPages <= maxVisibleButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(maxVisibleButtons / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxVisibleButtons / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxVisibleButtons;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxVisibleButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // Tombol Halaman Pertama
    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(<span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${currentPage === i 
                        ? 'z-10 bg-yellow-50 border-yellow-500 text-yellow-600' // Ganti warna tema
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {i}
        </button>
      );
    }

    // Tombol Halaman Terakhir
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>);
      }
      pageButtons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };


  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 text-yellow-500 mr-3 hidden sm:block" /> {/* Ganti warna tema */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors w-full sm:w-auto" // Ganti warna tema
        >
          <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
          Add New User
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            name="search-users"
            id="search-users"
            className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 text-gray-900 shadow-sm transition duration-150 ease-in-out sm:text-sm" // Ganti warna focus
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-yellow-700 uppercase tracking-wider">Joined</th>
              <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-yellow-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && users.length === 0 ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={`skeleton-${i}`} />)
            ) : !loading && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic text-base">
                  {searchTerm ? `No users found matching "${searchTerm}".` : "No users found. Click 'Add New User' to begin."}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                  // ... (logika userProfileImageUrl tetap sama)
                  let userProfileImageUrl = '';
                  if (user.profile_image_url) {
                      if (user.profile_image_url.startsWith('http')) {
                          userProfileImageUrl = user.profile_image_url;
                      } else {
                          userProfileImageUrl = `${LARAVEL_API_URL.replace(/\/+$/, '')}/${user.profile_image_url.replace(/^\/+/, '')}`;
                      }
                  }
                  return (
                      <tr key={user.id} className="hover:bg-yellow-50/60 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                              {userProfileImageUrl ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={userProfileImageUrl} alt={user.name} />
                              ) : (
                                  <UserCircleIcon className="h-10 w-10 text-gray-300" />
                              )}
                              </div>
                              <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              </div>
                          </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{user.email}</div></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                {user.role ? user.role.toUpperCase() : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Link to={`/admin/users/edit/${user.id}`} className="text-yellow-600 hover:text-yellow-700 p-1.5 rounded-md hover:bg-yellow-100 transition-all duration-150" title="Edit User"><PencilSquareIcon className="h-5 w-5 inline" /></Link>
                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-600 hover:text-red-700 p-1.5 rounded-md hover:bg-red-100 transition-all duration-150" title="Delete User"><TrashIcon className="h-5 w-5 inline" /></button>
                          </td>
                      </tr>
                  );
              })
            )}
            {loading && users.length > 0 && (
                <tr><td colSpan="5" className="text-center py-4"><p className="text-sm text-gray-500">Loading more users...</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi dengan Nomor Halaman */}
      {!loading && totalUsers > 0 && totalPages > 1 && (
        <div className="py-4 flex items-center justify-between border-t border-gray-200 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * perPage, totalUsers)}</span> of{' '}
                <span className="font-medium">{totalUsers}</span> results
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
                {renderPaginationButtons()} {/* Memanggil fungsi untuk render tombol halaman */}
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

export default UserManagementPage;
