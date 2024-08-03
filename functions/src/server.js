const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

require('dotenv').config();

// Middleware
const errorHandler = require('./middleware/errorHandler.js');
const { initializeFirebase } = require('./utils/initializeFirebase.js');

app.use(cors({
    origin: 'https://dyrplass-3ea73.web.app' // Ensure this is the correct origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Firebase
initializeFirebase();

// API routes
const routes = require('./routes');
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
