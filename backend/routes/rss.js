// backend/routes/rss.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

router.get('/', async (req, res) => {
    try {
        const { url } = req.query;
        console.log('RSS request received for:', url);

        // Check cache
        const cachedData = cache.get(url);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return res.json(cachedData.data);
        }

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/rss+xml, application/xml, text/xml',
                'Referer': 'https://www.reutersagency.com/',
                'Cache-Control': 'no-cache'
            },
            timeout: 5000
        });

        const feed = await parser.parseString(response.data);
        
        // Validate feed structure
        if (!feed.items || !Array.isArray(feed.items)) {
            throw new Error('Invalid feed format');
        }

        // Cache the result
        cache.set(url, {
            timestamp: Date.now(),
            data: feed
        });

        res.json(feed);

    } catch (error) {
        console.error('RSS Error:', error.response?.status, error.message);
        res.status(500).json({
            error: 'RSS fetch failed',
            details: error.message,
            status: error.response?.status
        });
    }
});

module.exports = router;