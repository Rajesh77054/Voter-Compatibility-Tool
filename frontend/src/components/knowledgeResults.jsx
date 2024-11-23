// frontend/src/components/KnowledgeResults.jsx
import React, { useState, useEffect } from 'react';
import '../styles/knowledgeResults.css';

const KnowledgeResults = ({ topic, position }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Map positions to query terms
  const getQueryTerms = (topic, position) => {
    const positionMap = {
      taxation: {
        1: ['low tax conservative policy US'],
        2: ['moderate conservative tax policy US'],
        3: ['centrist tax policy US'],
        4: ['moderate liberal tax policy US'],
        5: ['progressive tax policy US']
      },
      immigration: {
        1: ['strict immigration policy US'],
        2: ['conservative immigration reform US'],
        3: ['balanced immigration policy US'],
        4: ['liberal immigration reform US'],
        5: ['open immigration policy US']
      }
      // Add other topics
    };

    return positionMap[topic]?.[position] || [`${topic} policy United States`];
  };

  useEffect(() => {
    if (topic && position) {
      const API_KEY = process.env.REACT_APP_GOOGLE_KG_API_KEY;
      const fetchData = async () => {
        try {
          const queryTerms = getQueryTerms(topic, position);
          const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(queryTerms[0])}&types=Thing&types=Organization&types=Article&key=${API_KEY}&limit=3&languages=en&indent=true`;
          
          console.log('Query terms:', queryTerms);
          console.log('Fetching URL:', url);
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (!data?.itemListElement?.length) {
            setError('No results found');
            setResults([]);
            return;
          }

          // Filter and rank by relevance
          const relevantResults = data.itemListElement
            .filter(item => 
              item?.result?.description?.toLowerCase().includes('united states') ||
              item?.result?.detailedDescription?.articleBody?.toLowerCase().includes('united states')
            )
            .sort((a, b) => (b.resultScore || 0) - (a.resultScore || 0));

          if (relevantResults.length === 0) {
            setError(`No relevant results found for ${topic}`);
          } else {
            setResults(relevantResults);
            setError(null);
          }
        } catch (error) {
          console.error('KG Error:', error);
          setError(error.message);
        }
      };
      fetchData();
    }
  }, [topic, position]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="knowledge-grid">
      {results.map((item, i) => (
        <div key={i} className="knowledge-card">
          {item?.result?.image && (
            <div className="card-image">
              <img 
                src={item.result.image.contentUrl} 
                alt={item.result.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.log('Image failed to load:', item.result.image.contentUrl);
                }}
              />
            </div>
          )}
          <h3>{item?.result?.name}</h3>
          <p>{item?.result?.description}</p>
          {item?.result?.detailedDescription?.articleBody && (
            <p className="detailed-description">
              {item.result.detailedDescription.articleBody}
            </p>
          )}
          {item?.result?.url && (
            <a 
              href={item.result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="learn-more"
            >
              Learn more
            </a>
          )}
          <div className="metadata">
            <span>{item?.result['@type'] || 'Unknown type'}</span>
            <span>Relevance: {(item?.resultScore * 100).toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KnowledgeResults;
