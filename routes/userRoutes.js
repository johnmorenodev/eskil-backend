const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');

router.post(
  '/sign-up',
  [check('email').isEmail()],
  userController.postCreateUser
);

router.post(
  '/log-in',
  [check('email').isEmail()],
  userController.postUserLogin
);

router.use(checkAuth);

router.get('/user-data/:userId', userController.getUserData);
router.post('/addToCart/:productId', userController.postAddToCart);
router.patch('/changeQuantity/:productId', userController.patchChangeQuantity);
router.delete('/removeProduct/:productId', userController.deleteRemoveProduct);
router.get('/order-details/:orderId', userController.getOrderDetails);

module.exports = router;
