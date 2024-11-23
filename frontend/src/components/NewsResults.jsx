// frontend/src/components/NewsResults.jsx
import React, { useState, useEffect } from 'react';
import '../styles/newsResults.css';
import newsApis from '../services/newsApis';

const DEFAULT_IMAGE = '/images/news-placeholder.jpg'; // Add placeholder image

const NewsResults = ({ topic, position }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllNews = async () => {
    setIsLoading(true);
    try {
      const topics = {
        taxation: position,
        smallBusiness: position,
        // ... other topics
      };

      const results = await Promise.all([
        // newsApis.mediaStack.fetch(topics),
        // newsApis.newsApi.fetch(topics),
        newsApis.politicoRss.fetch(topics),
        newsApis.factcheckRss.fetch(topics),
        newsApis.reutersRss.fetch(topics),
        newsApis.nprRss.fetch(topics)
      ]);

      console.log('Source results:', {
        politico: results[0]?.length || 0,
        factcheck: results[1]?.length || 0,
        reuters: results[2]?.length || 0  // Add Reuters logging
      });

      // Take equal items from each source
      const combinedNews = [];
      const itemsPerSource = 2;

      results.forEach((sourceResults, index) => {
        if (sourceResults?.length) {
          console.log(`Source ${index} results:`, sourceResults);
          const sourceItems = sourceResults.slice(0, itemsPerSource);
          combinedNews.push(...sourceItems);
        }
      });

      console.log('Final combined news:', {
        total: combinedNews.length,
        sources: combinedNews.map(item => item.source)
      });

      setNews(combinedNews);
    } catch (error) {
      console.error('News fetch error:', error);
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (topic && position) {
      fetchAllNews();
    }
  }, [topic, position]);

  return (
    <div className="news-grid">
      {isLoading && <p>Loading news...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && news?.length > 0 ? (
        news.map((article, i) => (
          <div key={i} className="news-card">
            <div className="news-image-wrapper">
              <img
                src={article.image || DEFAULT_IMAGE}
                alt={article.title || 'News article'}
                className={`news-image ${!article.image ? 'placeholder' : ''}`}
                onError={(e) => e.target.src = DEFAULT_IMAGE}
              />
            </div>
            <div className="news-content">
              <h3>{article.title}</h3>
              <p>{article.description || article.content}</p>
              <div className="news-metadata">
                <span>{new Date(article.published_at || article.publishedAt).toLocaleDateString()}</span>
                <span>{article.source?.name || article.source}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No news articles found</p>
      )}
    </div>
  );
};

export default NewsResults;