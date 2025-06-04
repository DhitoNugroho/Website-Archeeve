import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useParams masih di support v5
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

const TagPage = () => {
  const { slug } = useParams();
  const [tagName, setTagName] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/tags/${slug}/articles`);
        // Backend perlu mengembalikan nama tag di response.data.tag.name
        setTagName(response.data.tag?.name || slug.replace(/-/g, ' ').toUpperCase());
        setArticles(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tag or articles.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="text-center text-xl mt-8 text-gray-600">Loading articles...</div>;
  if (error) return <div className="text-center text-xl text-red-500 mt-8">{error}</div>;

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Articles tagged with "{tagName}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 italic">No articles found for this tag.</p>
        )}
      </div>
    </div>
  );
};

export default TagPage;