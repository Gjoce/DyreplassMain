const express = require('express');
const app = express();
const admin = require('firebase-admin');
const cors = require('cors');
app.use(cors());
const serviceAccount = require('C:\\Users\\dimov\\OneDrive\\Desktop\\dyrplass-3ea73-firebase-adminsdk-f1znv-9cbc042070.json'); // Update with the correct path

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'dyrplass-3ea73' // Replace with your project ID
});

const db = admin.firestore();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('../public'));

// Route to get all puppies
app.get('/api/puppies', async (req, res) => {
    try {
        const puppiesSnapshot = await db.collection('puppies').get();
        const puppies = puppiesSnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id; // Make sure to include the document ID
            return data;
        });
        res.json(puppies);
    } catch (error) {
        console.error('Error fetching puppies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get a specific puppy by ID
app.get('/api/puppies/:id', async (req, res) => {
    try {
        const puppyDoc = await db.collection('puppies').doc(req.params.id).get();
        if (!puppyDoc.exists) {
            console.log('Puppy not found');
            res.status(404).json({ error: 'Puppy not found' });
        } else {
            const puppyData = puppyDoc.data();
            puppyData.id = puppyDoc.id;
            res.json(puppyData);
        }
    } catch (error) {
        console.error('Error fetching puppy:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Route to get breeder by ID
app.get('/api/breeders/:id', async (req, res) => {
    try {
        const breederDoc = await db.collection('breeders').doc(req.params.id).get();
        if (!breederDoc.exists) {
            console.log('Breeder not found');
            res.status(404).json({ error: 'Breeder not found' });
        } else {
            const breederData = breederDoc.data();
            breederData.id = breederDoc.id;
            res.json(breederData);
        }
    } catch (error) {
        console.error('Error fetching breeder:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

exports.api = functions.https.onRequest(app);

// Start the server
const PORT = 3307;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
