const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/userController');

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

router.get('/user-data/:userId', userController.getUserData);
module.exports = router;
