const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Import routes
const apiRoutes = require('./routes/api');
const contentRoutes = require('./routes/contents');
app.use('/api', apiRoutes);
app.use('/api/contents', contentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
