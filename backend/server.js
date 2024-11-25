const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport-setup');
const connectDB = require('./config/database');

// backend/server.js - Add at top
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Import routes
const userEngagementRoute = require('./routes/userEngagement');
const paymentService = require('./services/paymentGateway');
const authRoutes = require('./routes/auth');
const candidatePositionsRoute = require('./routes/candidatePositions');
const newsRoutes = require('./routes/news');

// Temporarily remove RSS routes
// let rssRoutes;
// try {
//   rssRoutes = require('./routes/rss');
// } catch (error) {
//   console.warn('RSS routes not available:', error.message);
// }

const app = express();

// Connect to database
connectDB();

// Session configuration - Add before CORS
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
const allowedOrigins = [
  'https://frontend-deployment-production-0b02.up.railway.app',
  'http://localhost:3000',
  'http://api.mediastack.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

// Add CSP middleware before routes
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://api.mediastack.com; img-src 'self' https:; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// Middleware
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Auth middleware - import and use
const auth = require('./middleware/auth');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user-engagement', userEngagementRoute);
app.use('/api/payment', paymentService);
app.use('/api/candidate-positions', candidatePositionsRoute);
app.use('/api', newsRoutes);

// Keep only this RSS fallback route
app.use('/api/rss', (req, res) => {
    res.status(503).json({ 
        message: 'RSS service temporarily unavailable',
        fallback: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml'
    });
});

// Google OAuth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/');
    }
);

// Protected admin routes example
app.use('/api/admin/*', auth, (req, res, next) => {
    if (req.adminId) {
        next();
    } else {
        res.status(401).json({ message: 'Admin access required' });
    }
});

// Static file serving
app.use(express.static(path.join(__dirname, '../frontend/build')));

// backend/server.js - Clean up error handlers
// Keep only one error handler before routes
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        path: req.path
    });
});

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Single listen with logging
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server environment:', process.env.NODE_ENV);
    console.log(`Server is running on port ${PORT}`);
    console.log('Database status:', mongoose.connection.readyState ? 'Connected' : 'Disconnected');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});