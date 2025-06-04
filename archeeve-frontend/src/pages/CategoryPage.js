// src/pages/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/categories/${slug}/articles`);
        setCategoryName(response.data.category?.name || response.data.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setArticles(response.data.articles || response.data.data || []);
      } catch (err) {
        setError('Failed to load articles for this category.');
        console.error("Error fetching category articles:", err.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    } else {
      setError('Category slug is missing.');
      setLoading(false);
    }
  }, [slug]);

  // State Loading, Error, dan konten utama tidak perlu lagi wrapper 'ml-0 lg:ml-72 xl:ml-80'
  // karena itu sudah dihandle di App.js
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500"> {/* Ganti text-yellow-500 dengan text-cheese-yellow */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4">
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
    // Div pembungkus halaman ini tidak lagi memerlukan margin kiri karena sudah diatur di App.js
    // dan tidak lagi memerlukan padding py-8/py-12 karena itu juga sudah di App.js pada <main>
    // Cukup fokus pada konten halaman ini saja.
    <div>
      {/* PERBAIKAN: 'mx-auto' dihilangkan dari div pembungkus judul dan grid */}
      <div className="max-w-6xl"> {/* Dulu ada mx-auto di sini, sekarang dihilangkan */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-10 text-center">
          Articles in: <span className="text-yellow-500">{categoryName}</span> {/* Ganti text-yellow-500 dengan text-cheese-yellow */}
        </h1>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-10V3M12 3v2M15 3v2M9 21v-2M12 21v-2M15 21v-2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-700">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no articles available in the "{categoryName}" category.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors" // Ganti warna bg-yellow-xxx
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;