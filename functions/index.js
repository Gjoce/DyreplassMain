const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const cors = require('cors');

app.use(cors({ origin: true }));
app.use(express.json());

const serviceAccount = require('C:\\Users\\dimov\\OneDrive\\Desktop\\dyrplass-3ea73-firebase-adminsdk-f1znv-9cbc042070.json'); // Adjust the path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'dyrplass-3ea73'
});

const db = admin.firestore();

app.get('/api/puppies', async (req, res) => {
    try {
        const puppiesSnapshot = await db.collection('puppies').get();
        const puppies = puppiesSnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
        });
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