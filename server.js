const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

// Import routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
