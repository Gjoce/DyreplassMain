const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
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

    router.get('/:id', async (req, res) => {
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

    return router;
};
