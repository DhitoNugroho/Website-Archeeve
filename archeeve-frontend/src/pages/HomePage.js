// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        setArticles(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('HomePage: Failed to load articles!', err);
        setError('Failed to load articles.');
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-12 text-secondary-text">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500 mt-12">{error}</div>;
  }

  return (
    <div className="py-10 px-4 md:px-0"> {/* Tambah padding horizontal untuk mobile */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-text">Latest Articles</h1>
        {/* Opsi: Garis aksen di bawah judul */}
        <div className="mt-3 h-1 w-24 bg-cheese-yellow mx-auto rounded"></div>
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"> {/* Sesuaikan gap */}
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="col-span-full text-center text-secondary-text text-lg mt-8">No articles found at the moment. Check back soon!</p>
      )}
    </div>
  );
};

export default HomePage;