const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'https://dyrplass-3ea73.web.app' // Ensure this is the correct origin
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));

// Initialize Firebase admin SDK
try {
    const firebaseConfig = process.env.FIREBASE_CONFIG_FILE;

    if (!firebaseConfig) {
        throw new Error('FIREBASE_CONFIG_FILE environment variable is not set');
    }

    const serviceAccount = JSON.parse(firebaseConfig);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    process.exit(1); // Exit the process with an error code
}

const db = admin.firestore();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// API routes
app.get('/api/puppies', async (req, res) => {
    try {
        const puppiesSnapshot = await db.collection('puppies').get();
        const puppies = puppiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(puppies);
    } catch (error) {
        console.error('Error fetching puppies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/puppies/:id', async (req, res) => {
    try {
        const puppyDoc = await db.collection('puppies').doc(req.params.id).get();
        if (!puppyDoc.exists) {
            console.log('Puppy not found');
            return res.status(404).json({ error: 'Puppy not found' });
        }
        const puppyData = { id: puppyDoc.id, ...puppyDoc.data() };
        res.json(puppyData);
    } catch (error) {
        console.error('Error fetching puppy:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/breeders/:id', async (req, res) => {
    try {
        const breederDoc = await db.collection('breeders').doc(req.params.id).get();
        if (!breederDoc.exists) {
            console.log('Breeder not found');
            return res.status(404).json({ error: 'Breeder not found' });
        }
        const breederData = { id: breederDoc.id, ...breederDoc.data() };
        res.json(breederData);
    } catch (error) {
        console.error('Error fetching breeder:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
