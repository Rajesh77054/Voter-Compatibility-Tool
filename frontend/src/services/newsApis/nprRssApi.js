// frontend/src/services/newsApis/nprRssApi.js
const RSS_URL = 'https://feeds.npr.org/1014/rss.xml';
const NPR_LOGO = 'https://media.npr.org/images/npr-default-social-square.jpg';

export default {
    fetch: async (topics) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rss?url=${encodeURIComponent(RSS_URL)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('NPR Politics RSS data:', {
                hasData: !!data,
                itemCount: data?.items?.length
            });
            
            if (!data?.items) {
                console.error('No items in NPR feed');
                return [];
            }
            
            const items = data.items
                .map(item => {
                    // Extract image URL from content
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.content || item.description;
                    
                    // Look for image in different possible locations
                    const imgElement = tempDiv.querySelector('picture img') || 
                                     tempDiv.querySelector('img.img') ||
                                     tempDiv.querySelector('img');
                    
                    let imageUrl = imgElement ? imgElement.src : NPR_LOGO;
                    
                    // Clean brightspot URL if present
                    if (imageUrl.includes('npr.brightspotcdn.com')) {
                        imageUrl = imgElement.getAttribute('data-template')?.replace('{width}', '600')
                                                                          .replace('{quality}', '85')
                                                                          .replace('{format}', 'jpeg') 
                                 || imageUrl;
                    }
                    
                    // Clean description text
                    const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                    
                    return {
                        title: item.title,
                        description: cleanDescription,
                        image: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
                        published_at: item.pubDate,
                        source: 'NPR Politics'
                    };
                })
                .slice(0, 5);

            return items;
        } catch (error) {
            console.error('NPR RSS error:', error);
            return [];
        }
    }
};