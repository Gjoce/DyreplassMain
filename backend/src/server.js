const express = require('express');
const cors = require('cors');
const path = require('path');
const request = require('request');
require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Express app
const app = express();

// Middleware
const errorHandler = require('./middleware/errorHandler.js');

// Firebase Initialization
const firebaseConfig = process.env.FIREBASE_CONFIG_FILE;
const serviceAccount = JSON.parse(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware setup
app.use(cors({
    origin: 'https://dyreplass.no' // Ensure this is the correct origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Proxy route for Google Drive images
app.get('/proxy', (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send('No URL provided');
    }

    request
        .get(imageUrl)
        .on('error', (err) => {
            res.status(500).send('Error fetching image');
        })
        .pipe(res);
});

// Pass `db` to routes
const puppiesRoutes = require('./api/puppies.js')(db);
const breedersRoutes = require('./api/breeders.js')(db);
app.use('/api/puppies', puppiesRoutes);
app.use('/api/breeders', breedersRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
