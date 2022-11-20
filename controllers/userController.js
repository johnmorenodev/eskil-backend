const User = require('../models/userModel');
const Product = require('../models/productModel');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createToken = id => {
  return jwt.sign({ id }, process.env.SECRET);
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

    return res.status(201).json({
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
      return res.status(200).json({
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
  const userId = req.userData.userId;

  try {
    const user = await User.findOne(
      { _id: userId },
      { name: 1, cart: 1, orders: 1 }
    )
      .populate({ path: 'cart.productId', select: 'imgUrl name price' })
      .exec();

    return res.status(200).json({ user });
  } catch (error) {
    return console.log(error);
  }
};

exports.postAddToCart = async (req, res) => {
  const userId = req.userData.userId;
  const { quantity, productId } = req.body;

  try {
    const user = await User.findById(userId, { cart: 1 });
    const productPrice = await Product.findById(productId, { price: 1 });
    const existingProduct = user.cart.find(el => el.productId == productId);
    let updatedCart = [];
    if (existingProduct) {
      const productIndex = user.cart.findIndex(el => el.productId == productId);

      let newProduct = {
        ...existingProduct.toObject(),
        quantity: existingProduct.quantity + quantity,
      };

      newProduct = {
        ...newProduct,
        subtotal: newProduct.quantity * productPrice.price,
      };
      updatedCart = user.cart;
      updatedCart.splice(productIndex, 1, newProduct);
      user.cart = updatedCart;

      user.total = user.cart.reduce((acc, user) => acc + user.subtotal, 0);
      await user.save();
      return res.status(201).json({ cart: user.cart });
    }

    updatedCart = [
      ...user.cart,
      { quantity, productId, subtotal: productPrice.price * quantity },
    ];
    user.cart = updatedCart;
    user.total = user.cart.reduce((acc, user) => acc + user.subtotal, 0);
    await user.save();
    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ messae: 'Error' });
  }
};

exports.patchChangeQuantity = async (req, res) => {
  const userId = req.userData.userId;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await User.findById(userId);

    const product = user.cart.find(product => product.productId == productId);
    const productPrice = await Product.findById(productId, { price: 1 });
    product.quantity = quantity;
    product.subtotal = product.quantity * productPrice.price;
    user.total = user.cart.reduce((acc, user) => acc + user.subtotal, 0);
    await user.save();

    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ message: 'Adding quantity failed.' });
  }
};

exports.deleteRemoveProduct = async (req, res) => {
  const userId = req.userData.userId;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    const currentCart = [...user.cart];
    const newCart = currentCart.filter(
      product => product.productId._id != productId
    );
    console.log(newCart);
    user.cart = newCart;
    user.total = user.cart.reduce((acc, user) => acc + user.subtotal, 0);
    await user.save();
    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed' });
  }
};
