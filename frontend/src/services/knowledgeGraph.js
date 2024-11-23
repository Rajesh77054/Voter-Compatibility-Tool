// frontend/src/services/knowledgeGraph.js
const API_KEY = process.env.REACT_APP_GOOGLE_KG_API_KEY;
const BASE_URL = 'https://kgsearch.googleapis.com/v1/entities:search';

// Map slider topics to search terms
const topicMappings = {
  'immigration': ['Immigration policy', 'Border control', 'Citizenship'],
  'economy': ['Economic policy', 'Fiscal policy', 'Taxation'],
  // Add other mappings
};

async function fetchTopicInfo(topic, position) {
  // Convert position (1-5) to relevant search terms
  const searchTerms = topicMappings[topic];
  const queries = searchTerms.map(term => ({
    query: term,
    limit: 3,
    types: ['Thing', 'Organization', 'Event'],
    languages: ['en']
  }));

  // Fetch data for each term
  const results = await Promise.all(
    queries.map(async q => {
      const params = new URLSearchParams({
        ...q,
        key: API_KEY
      });
      const response = await fetch(`${BASE_URL}?${params}`);
      return response.json();
    })
  );

  return results;
}