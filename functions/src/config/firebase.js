const admin = require('firebase-admin');
require('dotenv').config();

let db;

const initializeFirebase = () => {
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
        db = admin.firestore();
        console.log('Firestore DB initialized:', db !== undefined); // Add this line for logging
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        process.exit(1); // Exit the process with an error code
    }
};

module.exports = { initializeFirebase, db };
