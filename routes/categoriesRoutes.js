const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categoriesController');

router.get('/category/:categoryId', categoriesController.getCategoryProducts);
router.get('/categories', categoriesController.getCategories);

module.exports = router;
