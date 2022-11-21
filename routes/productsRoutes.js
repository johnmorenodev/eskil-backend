const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const stripeController = require('../controllers/stripeController');

router.get('/products/:productId', productController.getProductById);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.post('/products', productController.postProduct);
router.put('/products', productController.updateProduct);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeController.postWebhook
);

module.exports = router;
