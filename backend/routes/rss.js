// backend/routes/rss.js
const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const axios = require('axios');

router.get('/rss', async (req, res) => {
    try {
        const url = decodeURIComponent(req.query.url);
        console.log('RSS request received for:', url);

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // First verify feed exists with proper headers
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const parser = new Parser({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const feed = await parser.parseURL(url);
        console.log('Feed parsed successfully, items:', feed.items?.length);
        res.json(feed);
        
    } catch (error) {
        console.error('RSS Error:', error.message);
        res.status(500).json({ 
            error: 'RSS fetch failed', 
            details: error.message 
        });
    }
});

module.exports = router;