// src/pages/CategoriesListPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Sesuaikan path jika perlu

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Asumsi endpoint API untuk semua kategori adalah /categories
        const response = await api.get('/categories');
        // Sesuaikan dengan struktur data API Anda (misal response.data.data atau response.data)
        setCategories(response.data.data || response.data || []);
      } catch (err) {
        setError('Failed to load categories list.');
        console.error("Error fetching all categories:", err.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti dengan text-cheese-yellow */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading All Categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 font-sans">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"> {/* Ganti bg-yellow-500/600 */}
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12"> {/* Padding untuk halaman */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-10 text-center">
        All Categories
      </h1>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Grid untuk daftar kategori */}
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`} // Link ke halaman detail kategori (yang menampilkan artikel)
              className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-yellow-400 transform hover:-translate-y-1" // Ganti hover:border-yellow-400
            >
              <h2 className="text-xl font-semibold text-yellow-600 mb-2 truncate">{category.name}</h2> {/* Ganti text-yellow-600 */}
              {/* Anda bisa menambahkan jumlah artikel per kategori jika API menyediakan */}
              {/* <p className="text-sm text-gray-500">{category.articles_count || 0} articles</p> */}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic text-lg py-10">No categories available at the moment.</p>
      )}
    </div>
  );
};

export default CategoriesListPage;