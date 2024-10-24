require('dotenv').config(); // Load environment variables
const express = require('express');
const userEngagementRoute = require('./routes/userEngagement');
const paymentService = require('./services/paymentGateway');
const app = express();

// Middleware and routes
app.use(express.json());
app.use('/api/user-engagement', userEngagementRoute);
app.use('/api/payment', paymentService);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
