const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Express app
const app = express();

// Middleware
const errorHandler = require('./middleware/errorHandler.js');

// Firebase Initialization
const firebaseConfig = process.env.FIREBASE_CONFIG_FILE;

if (!firebaseConfig) {
    throw new Error('FIREBASE_CONFIG_FILE environment variable is not set');
}

const serviceAccount = JSON.parse(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase initialized successfully');
const db = admin.firestore();
console.log('Firestore DB initialized:', db !== undefined);

// Middleware setup
app.use(cors({
    origin: 'https://dyrplass-3ea73.web.app' // Ensure this is the correct origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Pass `db` to routes
const puppiesRoutes = require('./api/puppies')(db);
const breedersRoutes = require('./api/breeders')(db);
app.use('/api/puppies', puppiesRoutes);
app.use('/api/breeders', breedersRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
