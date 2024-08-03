const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.get('/:id', async (req, res) => {
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

    return router;
};
