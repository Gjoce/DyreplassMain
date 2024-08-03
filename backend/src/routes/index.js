const express = require('express');
const router = express.Router();
const puppiesRoutes = require('../api/puppies');
const breedersRoutes = require('../api/breeders');

router.use('/puppies', puppiesRoutes);
router.use('/breeders', breedersRoutes);

module.exports = router;
