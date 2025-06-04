import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

// Helper untuk mengambil query param dari URL (tetap sama)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const location = useLocation(); // Untuk mendapatkan location.search
  const history = useHistory();
  
  const [searchTerm, setSearchTerm] = useState('');         // Untuk input field
  const [submittedQuery, setSubmittedQuery] = useState(''); // Query yang terakhir dicari, untuk judul hasil
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);    // Apakah pencarian pernah dilakukan

  // Fungsi inti untuk melakukan pencarian
  const executeSearch = useCallback(async (query) => {
    const trimmedQuery = query.trim();
    
    setSubmittedQuery(trimmedQuery); // Selalu update submittedQuery untuk judul

    if (!trimmedQuery || trimmedQuery.length < 2) { // Minimal 2 karakter untuk search, atau jika query kosong
      setResults([]);
      setLoading(false); // Pastikan loading false
      setHasSearched(!!trimmedQuery); // True jika query tidak kosong tapi < 2 char, false jika query kosong
      // Hapus keyword dari URL jika query dikosongkan atau terlalu pendek setelah ada keyword
      if (location.search && (!trimmedQuery || trimmedQuery.length < 2)) {
        history.push('/search');
      }
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    // Update URL ketika pencarian dieksekusi
    if (location.search !== `?keyword=${encodeURIComponent(trimmedQuery)}`) {
        history.push(`/search?keyword=${encodeURIComponent(trimmedQuery)}`);
    }

    try {
      const response = await api.get(`/articles/search?keyword=${encodeURIComponent(trimmedQuery)}`);
      setResults(response.data.data || response.data || []);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error("Search error:", err.response?.data || err.message || err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [history, location.search]); // useCallback dependencies

  // Effect untuk load awal dari URL & jika URL berubah (misal, navigasi back/forward)
  useEffect(() => {
    const initialKeywordFromUrl = new URLSearchParams(location.search).get('keyword');
    if (initialKeywordFromUrl !== null) { // Jika parameter 'keyword' ada di URL
      setSearchTerm(initialKeywordFromUrl); // Set input field
      // Hanya jalankan executeSearch jika berbeda dari submittedQuery terakhir untuk menghindari loop dengan history.push
      if (initialKeywordFromUrl !== submittedQuery) {
        executeSearch(initialKeywordFromUrl);
      }
    } else {
        // Jika tidak ada keyword di URL, reset state pencarian
        setSearchTerm('');
        if (submittedQuery || results.length > 0 || hasSearched) { // Hanya reset jika sebelumnya ada state pencarian
            setSubmittedQuery('');
            setResults([]);
            setHasSearched(false);
        }
    }
  }, [location.search, executeSearch, submittedQuery, results.length, hasSearched]);

  // Effect untuk debouncing saat pengguna mengetik di input field
  useEffect(() => {
    // Jangan jalankan debounce jika searchTerm sama dengan yang sudah ada di URL (sudah dihandle effect di atas)
    const currentKeywordInUrl = new URLSearchParams(location.search).get('keyword') || '';
    if (searchTerm === currentKeywordInUrl && searchTerm === submittedQuery) {
      return;
    }
    
    // Jika searchTerm kosong setelah pengguna mengetik, kita ingin mengosongkan hasil
    if (!searchTerm.trim() && (hasSearched || submittedQuery) ) {
        const timerId = setTimeout(() => {
            executeSearch(''); // Ini akan mengosongkan hasil dan URL
        }, 500); // Debounce untuk pengosongan juga
        return () => clearTimeout(timerId);
    }

    // Hanya jalankan debounce jika ada searchTerm dan panjangnya cukup
    if (searchTerm.trim() && searchTerm.trim().length >= 2) {
      const timerId = setTimeout(() => {
        executeSearch(searchTerm);
      }, 500); // 500ms debounce delay

      return () => clearTimeout(timerId); // Cleanup timeout jika searchTerm berubah lagi
    }
  }, [searchTerm, executeSearch, location.search, submittedQuery, hasSearched]);


  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle submit form (jika tombol search tetap ada)
  const handleSubmit = (event) => {
    event.preventDefault();
    executeSearch(searchTerm); // Langsung eksekusi tanpa debounce
  };
  
  // Render loading, error (tetap sama seperti sebelumnya)
  if (loading && !hasSearched) { // Loading awal khusus
    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-300px)] text-yellow-500 font-sans">
            {/* ... SVG spinner ... */}
            <p className="text-xl font-semibold">Initializing search...</p>
        </div>
    );
  }


  return (
    <div className="font-sans">
      <div className="max-w-3xl mx-auto mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Search Articles
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center">
            <input
              type="search"
              name="search"
              id="search"
              className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-5 pr-16 py-3.5 border-gray-300 rounded-full
                         text-gray-900 placeholder-gray-500 shadow-sm sm:text-sm
                         transition duration-150 ease-in-out" // Ganti warna tema
              placeholder="Type keywords (e.g., crypto, tech)"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center px-6 py-3.5 border border-transparent 
                         text-sm font-semibold rounded-r-full text-white bg-yellow-500 hover:bg-yellow-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors" // Ganti warna tema
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 hidden sm:inline">Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Hasil Pencarian */}
      {/* Tampilkan loading spinner jika sedang loading hasil, kecuali ini adalah loading awal tanpa search */}
      {loading && hasSearched && (
         <div className="flex justify-center items-center py-10 text-yellow-500">
            <svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-lg">Searching...</span>
        </div>
      )}

      {error && ( // Tampilkan error jika ada
        <div className="px-4 font-sans">
            <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
                <p>{error}</p>
                <button
                    onClick={() => executeSearch(submittedQuery)}
                    className="mt-4 mr-2 inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                >
                    Try Again
                </button>
                <Link to="/" className="mt-4 inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all">
                    Go to Homepage
                </Link>
            </div>
        </div>
      )}

      {!loading && !error && hasSearched && ( // Hanya tampilkan bagian hasil jika pencarian sudah dilakukan & tidak loading/error
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
            {results.length > 0 
              ? `Search Results for: ` 
              : `No articles found matching: `} 
            <span className="text-yellow-500">{submittedQuery}</span> {/* Ganti text-yellow-500 */}
          </h2>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-800">No Matches Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Try refining your search terms or explore our categories.
                </p>
                <div className="mt-6">
                    <Link
                        to="/categories"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors" // Ganti warna bg-yellow-xxx
                    >
                        Browse Categories
                    </Link>
                </div>
            </div>
          )}
        </div>
      )}

      {!hasSearched && !loading && !error && ( // Pesan awal jika belum ada pencarian
        <div className="text-center py-16 text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-xl">Find interesting articles by typing keywords above.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;