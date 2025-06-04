import React from 'react';
import { Link } from 'react-router-dom';

const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

const ArticleCard = ({ article }) => {
  let imageUrlToDisplay;

  const imagePathFromApi = article.image_url || article.image;

  if (imagePathFromApi && typeof imagePathFromApi === 'string') {
    
    if (imagePathFromApi.startsWith('http://') || imagePathFromApi.startsWith('https://')) {
      imageUrlToDisplay = imagePathFromApi;
    } else {
      
      const cleanPath = imagePathFromApi.startsWith('/') ? imagePathFromApi.substring(1) : imagePathFromApi;
      imageUrlToDisplay = `${LARAVEL_API_URL}/${cleanPath}`;
    }
  } else {
    
    imageUrlToDisplay = `https://ui-avatars.com/api/?name=${encodeURIComponent(article.title || 'A')}&background=F3F4F6&color=8E8E8E&size=400x250&font-size=0.33&bold=true&format=svg`;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-xl">
      <Link to={`/articles/${article.slug}`} className="block group">
        <img
          src={imageUrlToDisplay} 
          alt={article.title || 'Article image'}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        {article.category && (
          <Link
            to={`/categories/${article.category.slug}`}
            className="inline-block text-xs text-cheese-yellow font-semibold uppercase tracking-wider mb-2 hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <h2 className="text-xl lg:text-2xl font-semibold mb-3 text-primary-text leading-tight">
          <Link to={`/articles/${article.slug}`} className="hover:text-cheese-yellow transition-colors duration-200">
            {article.title}
          </Link>
        </h2>
        
        <div 
            className="text-secondary-text text-base mb-4 line-clamp-3 flex-grow"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content preview available.</p>" }}
        ></div>

        <div className="mt-auto">
            <p className="text-secondary-text text-sm mb-4">
                By {article.user?.name || 'Unknown Author'} 
                <span className="mx-1">&bull;</span> 
                {new Date(article.published_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                    <Link
                        key={tag.id}
                        to={`/tags/${tag.slug}`}
                        className="inline-block bg-light-gray text-secondary-text text-xs px-3 py-1 rounded-full hover:bg-gray-200 hover:text-primary-text transition-colors duration-200"
                    >
                        #{tag.name}
                    </Link>
                    ))}
                </div>
            )}

            <Link 
                to={`/articles/${article.slug}`} 
                className="inline-flex items-center text-base font-medium text-cheese-yellow hover:text-yellow-500 transition-colors duration-200 group"
            >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;