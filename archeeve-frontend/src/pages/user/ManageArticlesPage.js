// src/pages/user/ManageArticlesPage.js
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // Tidak digunakan saat ini

const ManageArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Untuk pesan sukses setelah delete

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const response = await api.get('/user/articles'); // Endpoint sudah benar
      setArticles(response.data.data || response.data);
    } catch (err) {
      setError(`Failed to load your articles. ${err.response?.data?.message || err.message}`);
      console.error("Fetch articles error:", err.response || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await api.delete(`/articles/${articleId}`);
        setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
        setSuccessMessage('Article deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Hilangkan pesan setelah 3 detik
      } catch (err) {
        setError(`Failed to delete article. ${err.response?.data?.message || err.message}`);
        console.error("Delete article error:", err.response || err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl text-secondary-text">Loading your articles...</div></div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4"><div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p className="font-bold">Error</p><p>{error}</p></div></div>;
  }

  return (
    <div className="py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-text text-center sm:text-left mb-4 sm:mb-0">Manage My Articles</h1>
        <Link 
            to="/articles/create" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-cheese-yellow hover:opacity-90 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300"
        >
          Create New Article
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          {successMessage}
        </div>
      )}

      {articles.length > 0 ? (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead className="bg-light-gray">
              <tr>
                {['Title', 'Category', 'Status', 'Published', 'Actions'].map(header => (
                  <th 
                    key={header}
                    className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-secondary-text uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link to={`/articles/${article.slug}`} className="text-primary-text hover:text-cheese-yellow font-medium block max-w-xs truncate" title={article.title}>
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-secondary-text">
                    {article.category?.name || <span className="italic text-gray-400">N/A</span>}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold leading-tight rounded-full ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700' // archived atau status lain
                    }`}>
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-secondary-text">
                    {article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB') : <span className="italic text-gray-400">Not Published</span>}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/articles/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-800 mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-secondary-text italic py-12 bg-white shadow-md rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0V5a2 2 0 00-2-2h-2M5 19v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-primary-text">No articles found</h3>
            <p className="mt-1 text-sm text-secondary-text">You haven't created any articles yet.</p>
            <div className="mt-6">
                <Link 
                    to="/articles/create" 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cheese-yellow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create new article
                </Link>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageArticlesPage;