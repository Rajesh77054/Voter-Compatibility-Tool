// frontend/src/services/newsApis/reutersRssApi.js
const RSS_URL = 'https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best';
const REUTERS_FAVICON = 'https://www.reutersagency.com/wp-content/uploads/2024/06/reuters-favicon-2-150x150.png';

export default {
    fetch: async (topics) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rss?url=${encodeURIComponent(RSS_URL)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            const items = data.items
                .map(item => {
                    // Clean HTML from content
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.content || item.description;
                    const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                    
                    return {
                        title: item.title,
                        description: cleanDescription,
                        image: REUTERS_FAVICON,
                        published_at: item.pubDate,
                        source: 'Reuters'
                    };
                })
                .slice(0, 5);

            return items;
        } catch (error) {
            console.error('Reuters RSS error:', error);
            return [];
        }
    }
};