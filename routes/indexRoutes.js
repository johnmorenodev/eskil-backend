const express = require('express');
const router = express.Router();

const featuredController = require('../controllers/featuredController');
const categoriesController = require('../controllers/categoriesController');

router.get('/featured', featuredController.getFeaturedProducts);
router.post('/featured', featuredController.postFeaturedProducts);

router.get('/categories', categoriesController.getCategories);
router.post('/categories', categoriesController.postCategories);

module.exports = router;
