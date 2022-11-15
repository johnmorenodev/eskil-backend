const User = require('../models/userModel');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = id => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
};

exports.postCreateUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new Error();
    }

    const existingEmail = await User.findOne({ email: email }).exec();
    if (existingEmail) {
      throw new Error();
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: username,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({
      userId: user._id,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return console.log('user does not exist');
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = createToken(user._id);
      console.log({ userId: user._id, token: token });

      res.status(200).json({
        userId: user._id,
        token: token,
      });
    }

    if (!match) {
      return console.log('wrong password');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne(
      { _id: userId },
      { name: 1, cart: 1, orders: 1 }
    ).exec();
    res.status(200).json({ user });
  } catch (error) {
    return console.log(error);
  }
};
