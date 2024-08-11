const express = require('express');
const admin = require('firebase-admin');

module.exports = (db) => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or malformed' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        try {
            // Verify the ID token
            const decodedToken = await admin.auth().verifyIdToken(idToken);

            // Check if the user is an admin or perform other necessary checks
            if (decodedToken && decodedToken.email) {
                // Return a custom token or simply confirm success
                res.json({ message: 'Token is valid', token: idToken });
            } else {
                res.status(403).json({ message: 'Unauthorized access' });
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(403).json({ message: 'Invalid token' });
        }
    });

    return router;
};
