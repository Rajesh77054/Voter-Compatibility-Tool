// frontend/src/services/newsApis/newsApi.js
const PREFERRED_SOURCES = [
    'reuters',
    'associated-press',
    'politico',
    'npr',
    'the-guardian',
    'bbc-news',
    'abc-news',
    'cbs-news',
    'nbc-news'
].join(',');

export default {
    fetch: async (topics) => {
        try {
            const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
            
            // Create keyword string from all topics
            const keywords = Object.keys(topics)
                .map(topic => `${topic} politics`)
                .join(' OR ');

            const params = new URLSearchParams({
                apiKey: API_KEY,
                q: keywords,
                sources: PREFERRED_SOURCES,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 10
            });

            console.log('Search keywords:', keywords);

            const url = `https://newsapi.org/v2/everything?${params}`;
            const response = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });

            const data = await response.json();
            return data.articles
                ?.filter(article => article.image || article.urlToImage)
                .map(article => ({
                    title: article.title,
                    description: article.description,
                    image: article.urlToImage,
                    published_at: article.publishedAt,
                    source: article.source.name
                }))
                .slice(0, 3) || [];
        } catch (error) {
            console.error('NewsAPI error:', error);
            return [];
        }
    }
};
