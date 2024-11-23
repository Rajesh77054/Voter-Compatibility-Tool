// frontend/src/services/newsApis/mediaStackApi.js
const PREFERRED_SOURCES = [
    'reuters', 'ap', 'politico', 'npr', 'guardian',
    'bbc-news', 'abc-news', 'cbs-news', 'nbc-news'
];

export default {
    fetch: async (topics) => {
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const API_KEY = process.env.REACT_APP_MEDIASTACK_KEY;

            // Create keywords from all topics using OR
            const keywords = Object.keys(topics)
                .map(topic => `${topic} politics`)
                .join(' OR ');

            const params = {
                access_key: API_KEY,
                categories: 'general,business',
                countries: 'us',
                languages: 'en',
                keywords: keywords,
                sort: 'published_desc',
                limit: 10
            };

            console.log('MediaStack keywords:', keywords);

            const response = await fetch(`${API_URL}/api/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.data) {
                return [];
            }

            // Map response to consistent format
            return data.articles
                ?.filter(article => article.image || article.urlToImage)
                .map(article => ({
                    title: article.title,
                    description: article.description,
                    image: article.image || article.urlToImage,
                    published_at: article.published_at,
                    source: article.source
                }))
                .slice(0, 3);

        } catch (error) {
            console.error('MediaStack API error:', error);
            return [];
        }
    }
};