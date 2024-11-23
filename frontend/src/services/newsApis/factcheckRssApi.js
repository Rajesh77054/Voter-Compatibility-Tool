// frontend/src/services/newsApis/factcheckRssApi.js
const RSS_URL = 'https://www.factcheck.org/feed/';

export default {
    fetch: async (topics) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rss?url=${encodeURIComponent(RSS_URL)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Factcheck RSS data:', {
                hasData: !!data,
                itemCount: data?.items?.length
            });
            
            const items = data.items
                .map(item => {
                    const contentStr = item['content:encoded'] || item.content || '';
                    const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/);
                    const imageUrl = imgMatch?.[1] || item.enclosure?.url || null;
                    
                    // Only return items with actual images
                    if (!imageUrl) return null;

                    // Clean HTML tags from description
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description || item.content;
                    const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                    
                    return {
                        title: item.title,
                        description: cleanDescription,
                        image: imageUrl,
                        published_at: item.pubDate,
                        source: 'FactCheck.org'
                    };
                })
                .filter(Boolean)
                .slice(0, 5);

            return items;
        } catch (error) {
            console.error('Factcheck RSS error:', error);
            return [];
        }
    }
};