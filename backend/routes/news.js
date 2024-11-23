// backend/routes/news.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const TIER1_SOURCES = new Set([
    'reuters',
    'ap',
    'politico',
    'npr',
    'guardian',
    'bbc-news',
    'abc-news',
    'cbs-news',
    'nbc-news'
]);

router.post('/news', async (req, res) => {
    try {
        const API_KEY = process.env.MEDIASTACK_API_KEY;
        if (!API_KEY) {
            throw new Error('MediaStack API key not configured');
        }

        // Simplify search terms
        const searchTerm = req.body.keywords.split(' ')[0]; // Just use 'tax' instead of 'centrist tax policy'
        console.log('Search term:', searchTerm);

        const url = `http://api.mediastack.com/v1/news?` + 
            new URLSearchParams({
                access_key: API_KEY,
                categories: 'general,business', // Can't use 'politics' category
                countries: 'us',
                languages: 'en',
                keywords: searchTerm,
                sort: 'published_desc',
                limit: '25' // Increased to find more matches
            });

        console.log('Making request with params:', {
            categories: 'general,business',
            countries: 'us',
            languages: 'en',
            keywords: searchTerm
        });

        const response = await fetch(url);
        const data = await response.json();

        console.log('MediaStack response:', {
            hasData: !!data.data,
            count: data.data?.length || 0,
            sources: [...new Set(data.data?.map(item => item.source))]
        });

        if (data.error) {
            throw new Error(`MediaStack error: ${data.error.message}`);
        }

        // Log found sources
        console.log('Sources found:', 
            [...new Set(data.data?.map(item => item.source))]
        );

        // Filter for preferred sources
        const filteredNews = data.data
            ?.filter(article => TIER1_SOURCES.has(article.source))
            .slice(0, 3);

        // Return filtered or fallback news
        const finalNews = filteredNews?.length ? filteredNews : data.data?.slice(0, 3);

        res.json({ data: finalNews || [] });
    } catch (error) {
        console.error('News error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/sources', async (req, res) => {
    try {
        const API_KEY = process.env.MEDIASTACK_API_KEY;
        if (!API_KEY) {
            throw new Error('MediaStack API key not configured');
        }

        // Use news endpoint with source filtering instead
        const url = 'http://api.mediastack.com/v1/news';
        const params = new URLSearchParams({
            access_key: API_KEY,
            countries: 'us',
            languages: 'en',
            limit: 100
        });

        console.log('Fetching news to extract sources...');
        const response = await fetch(`${url}?${params}`);
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`MediaStack API error: ${data.error.message}`);
        }

        // Extract unique sources from news results
        const sources = [...new Set(data.data?.map(item => item.source))];
        console.log('Available sources:', sources);

        res.json({ sources });
    } catch (error) {
        console.error('Sources error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;