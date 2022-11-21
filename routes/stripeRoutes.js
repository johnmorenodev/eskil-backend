const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const stripeController = require('../controllers/stripeController');

router.use(checkAuth);

router.post('/create-checkout-session', stripeController.postCheckout);

module.exports = router;
