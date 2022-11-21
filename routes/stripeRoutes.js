const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const stripeController = require('../controllers/stripeController');

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeController.postWebhook
);

router.use(checkAuth);

router.post('/create-checkout-session', stripeController.postCheckout);

module.exports = router;
