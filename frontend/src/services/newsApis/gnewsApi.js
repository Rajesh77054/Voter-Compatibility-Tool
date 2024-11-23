// frontend/src/services/newsApis/gnewsApi.js
const PREFERRED_SOURCES = new Set([
    'reuters.com',
    'apnews.com',
    'politico.com',
    'npr.org',
    'theguardian.com',
    'bbc.com',
    'abcnews.go.com',
    'cbsnews.com',
    'nbcnews.com'
]);

export default {
    fetch: async (topic, position) => {
        try {
            const API_KEY = process.env.REACT_APP_GNEWS_API_KEY;
            const params = new URLSearchParams({
                q: `${topic} politics`,
                lang: 'en',
                country: 'us',
                max: 10,
                apikey: API_KEY,
                sortby: 'publishedAt'
            });

            const response = await fetch(`https://gnews.io/api/v4/search?${params}`);
            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0]);
            }

            // Filter for preferred sources
            const articles = data.articles
                ?.filter(article => article.image || article.urlToImage)
                .map(article => ({
                    // ... mapping
                }))
                .filter(article => {
                    const domain = new URL(article.source.url).hostname;
                    return PREFERRED_SOURCES.has(domain);
                }) || [];

            return articles.slice(0, 3);
        } catch (error) {
            console.error('GNews API error:', error);
            return [];
        }
    }
};