// frontend/src/services/newsApis/politicoRssApi.js
const RSS_URL = 'https://rss.politico.com/politics-news.xml';

export default {
    fetch: async (topics) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rss?url=${encodeURIComponent(RSS_URL)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Raw RSS item example:', {
                title: data.items?.[0]?.title,
                content: data.items?.[0]?.content,
                'content:encoded': data.items?.[0]?.['content:encoded'],
                enclosure: data.items?.[0]?.enclosure
            });
            
            const items = data.items
                .map(item => {
                    const contentStr = item['content:encoded'] || item.content || '';
                    const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/);
                    const imageUrl = imgMatch?.[1] || item.enclosure?.url || null;
                    
                    // Only return items with actual images
                    if (!imageUrl) return null;
                    
                    return {
                        title: item.title,
                        description: item.description || item.content,
                        image: imageUrl,
                        published_at: item.pubDate,
                        source: 'Politico'
                    };
                })
                .filter(Boolean) // Remove null items
                .slice(0, 5);

            return items;
        } catch (error) {
            console.error('Politico RSS error:', error);
            return [];
        }
    }
};