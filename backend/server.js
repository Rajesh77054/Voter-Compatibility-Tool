// /backend/server.js

const express = require('express');
const path = require('path');
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Define your API routes here
const userEngagementRoute = require('./routes/userEngagement');
const paymentService = require('./services/paymentGateway');

app.use('/api/user-engagement', userEngagementRoute);
app.use('/api/payment', paymentService);

// Add a root route to handle the base URL
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

// Serve static files from the frontend build (if applicable)
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
