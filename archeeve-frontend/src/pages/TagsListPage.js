import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TagsListPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk query pencarian

  useEffect(() => {
    const fetchAllTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/tags');
        setTags(response.data.data || response.data || []);
      } catch (err) {
        setError('Failed to load tags list.');
        console.error("Error fetching all tags:", err.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTags();
  }, []);

  // Handler untuk perubahan input pencarian
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter tags berdasarkan searchQuery
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading All Tags...</p>
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
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        All Tags
      </h1>

      {/* Input Pencarian */}
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="search-tags"
            id="search-tags"
            className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2.5 border-gray-300 rounded-lg
                       leading-5 bg-white placeholder-gray-500 text-gray-900 shadow-sm
                       transition duration-150 ease-in-out sm:text-sm" // Ganti warna focus ring/border
            placeholder="Search tags..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Daftar Tag */}
      {tags.length === 0 && !loading ? ( // Kondisi jika tidak ada tag sama sekali (bukan hasil filter)
        <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-700">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">
            There are currently no tags available.
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
      ) : filteredTags.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {filteredTags.map(tag => (
            <Link
              key={tag.id}
              to={`/tags/${tag.slug}`}
              className="bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200 hover:border-yellow-400 hover:text-yellow-800 
                         px-4 py-2 rounded-full text-sm sm:text-base font-medium shadow-sm
                         transition-all duration-200 ease-in-out transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70" // Ganti warna tema
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic text-lg py-10">
          No tags found matching your search: "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default TagsListPage;