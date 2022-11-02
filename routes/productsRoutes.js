const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products/:productId', productController.getProduct);
router.post('/products', productController.postProduct);

module.exports = router;
