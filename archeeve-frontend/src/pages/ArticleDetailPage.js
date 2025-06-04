// src/pages/ArticleDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../context/AuthContext';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/articles/${slug}`);
      console.log("Article data from API:", response.data);
      setArticle(response.data);
    } catch (err) {
      setError('Failed to load article. It might have been moved or deleted.');
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const handleNewComment = (newComment) => {
    const commentToAdd = {
        ...newComment,
        user: newComment.user || (user && newComment.user_id === user.id ? { name: user.name, id: user.id } : null),
        guest_name: newComment.guest_name || (!newComment.user && !user ? 'Guest' : null)
    };
    setArticle(prevArticle => ({
      ...prevArticle,
      comments: prevArticle.comments 
                  ? [...prevArticle.comments, commentToAdd].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)) 
                  : [commentToAdd]
    }));
  };

  const shareArticle = (platform) => {
    const articleUrl = window.location.href;
    const articleTitle = article?.title || "Check out this article!";
    const articleDescription = article?.content ? article.content.substring(0, 150) + '...' : '';

    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(articleDescription)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this article: ${articleTitle} - ${articleUrl}`)}`;
    } else if (platform === 'email') {
      shareUrl = `mailto:?subject=${encodeURIComponent(`Check out this article: ${articleTitle}`)}&body=${encodeURIComponent(`I found this interesting article: ${articleUrl}\n\n${articleDescription}`)}`;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 dengan text-cheese-yellow */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading article...</p>
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

  if (!article) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 text-center font-sans">
          <p className="text-2xl text-gray-600 font-semibold mb-4">Article Not Found</p>
          <p className="text-gray-500 mb-6">The article you are looking for does not exist or may have been removed.</p>
          <Link to="/" className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"> {/* Ganti bg-yellow-500/600 */}
              Back to Home
          </Link>
      </div>
    );
  }

  let imageUrlToDisplay;
  const imagePathFromApi = article.image_url || article.image;

  if (imagePathFromApi && typeof imagePathFromApi === 'string') {
    if (imagePathFromApi.startsWith('http://') || imagePathFromApi.startsWith('https://')) {
      imageUrlToDisplay = imagePathFromApi;
    } else {
      const cleanPath = imagePathFromApi.startsWith('/') ? imagePathFromApi.substring(1) : imagePathFromApi;
      imageUrlToDisplay = `${LARAVEL_API_URL.replace(/\/+$/, '')}/${cleanPath}`;
    }
  } else {
    imageUrlToDisplay = `https://via.placeholder.com/1200x600/FFF8DC/4A5568?text=${encodeURIComponent(article.title || 'Archeeve Article')}`; // Cornsilk bg, gray text
  }

  return (
    // Kontainer utama halaman detail artikel. 
    <div className="font-sans py-8 md:py-12 px-4"> {/* Tambahkan padding horizontal dasar */}
      <article className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200"> {/* Lebih menonjolkan shadow & border */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight"> {/* Font lebih tebal, warna sedikit lebih lembut dari hitam pekat */}
          {article.title}
        </h1>
        <div className="text-sm text-gray-500 mb-6 md:mb-8 flex flex-wrap items-center gap-x-3 gap-y-1"> {/* Penyesuaian gap */}
          <span>
            By <Link to={`/author/${article.user?.id}`} className="font-semibold text-yellow-500 hover:text-yellow-600 hover:underline transition-colors"> {/* Ganti text-yellow-500/600 */}
              {article.user?.name || 'Unknown Author'}
            </Link>
          </span>
          <span className="text-gray-400">&bull;</span>
          <span>
            Published on {new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-gray-400">&bull;</span>
          <span>{article.views_count || 0} views</span>
        </div>

        {imageUrlToDisplay && (
          <img
            src={imageUrlToDisplay}
            alt={article.title}
            className="w-full aspect-[16/9] md:aspect-[2/1] object-cover rounded-lg shadow-lg mb-6 md:mb-8 border border-gray-100"
          />
        )}

        <div
          className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed 
                     prose-headings:font-semibold prose-headings:text-gray-800 
                     prose-a:text-yellow-600 hover:prose-a:text-yellow-700 prose-a:font-medium prose-a:transition-colors prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-gray-800 prose-strong:font-semibold
                     prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50/70 prose-blockquote:text-gray-700 prose-blockquote:p-4 prose-blockquote:rounded-r-md prose-blockquote:shadow-sm
                     mb-8 md:mb-10" // Ganti warna prose-a, blockquote
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {(article.category || (article.tags && article.tags.length > 0)) && (
          <div className="border-t border-b border-yellow-200/80 py-5 my-6 md:my-8"> {/* Border tema */}
            <div className="flex flex-wrap items-center gap-3">
              {article.category && (
                <Link
                  to={`/categories/${article.category.slug}`}
                  className="bg-yellow-500 text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-300 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70" // Ganti bg-yellow-xxx
                >
                  {article.category.name}
                </Link>
              )}
              {article.tags && article.tags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}`}
                  className="bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs sm:text-sm px-3 py-1 rounded-full font-medium hover:bg-yellow-200 hover:border-yellow-400 hover:text-yellow-800 transition-colors duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-70" // Ganti warna
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="my-8 md:my-10">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Share this Article:</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => shareArticle('facebook')} className="bg-[#1877F2] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 shadow"><i className="fab fa-facebook-f"></i> <span>Facebook</span></button>
            <button onClick={() => shareArticle('twitter')} className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 shadow"><i className="fab fa-twitter"></i> <span>Twitter</span></button>
            <button onClick={() => shareArticle('linkedin')} className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 shadow"><i className="fab fa-linkedin-in"></i> <span>LinkedIn</span></button>
            <button onClick={() => shareArticle('whatsapp')} className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 shadow"><i className="fab fa-whatsapp"></i> <span>WhatsApp</span></button>
            <button onClick={() => shareArticle('email')} className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 hover:bg-gray-600 transition-colors duration-200 shadow"><i className="fas fa-envelope"></i> <span>Email</span></button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 md:pt-10 md:mt-10"> {/* Border pemisah standar */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Comments ({article.comments?.filter(comment => comment.approved).length || 0})
          </h2>
          <div className="space-y-6 mb-8">
            {article.comments && article.comments.filter(comment => comment.approved).length > 0 ? (
              article.comments.filter(comment => comment.approved).map(comment => (
                <div key={comment.id} className="bg-yellow-50/60 p-4 sm:p-5 rounded-lg shadow border border-yellow-200/70"> {/* Warna tema untuk komentar */}
                  <div className="flex items-start space-x-3">
                      <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-md sm:text-lg mb-0.5">
                              {comment.user ? comment.user.name : comment.guest_name || 'Anonymous'}
                          </p>
                          <p className="text-gray-500 text-xs mb-2">
                              {new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(comment.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                      </div>
                  </div>
                  <p className="mt-2 text-gray-700 leading-relaxed text-sm sm:text-base">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
          <CommentForm
              articleId={article.id}
              onCommentSubmitted={handleNewComment}
              // Contoh passing class untuk styling internal CommentForm:
              // inputClassName="focus:border-yellow-500 focus:ring-yellow-500"
              // buttonClassName="bg-yellow-500 hover:bg-yellow-600 text-white"
          />
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;