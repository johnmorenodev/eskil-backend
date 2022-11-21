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
    return res.status(401).json({ message: 'Failed to create user.' });
  }
};

exports.postUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(401).json({ message: 'User does not exist.' });
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
    return res.status(401).json({ message: 'Failed to log in user.' });
  }
};

exports.getUserData = async (req, res) => {
  const userId = req.userData.userId;

  try {
    const user = await User.findOne(
      { _id: userId },
      { name: 1, cart: 1, orders: 1, total: 1 }
    )
      .populate({ path: 'cart.productId', select: 'imgUrl name price' })
      .exec();
    return res.status(200).json(user);
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

      const subtotal = newProduct.quantity * productPrice.price;

      newProduct = {
        ...newProduct,
        subtotal: +subtotal.toFixed(2),
      };
      updatedCart = user.cart;
      updatedCart.splice(productIndex, 1, newProduct);
      user.cart = updatedCart;

      const userTotal = user.cart.reduce(
        (acc, user) => acc + +user.subtotal.toFixed(2),
        0
      );
      user.total = +userTotal.toFixed(2);
      await user.save();
      return res.status(201).json({ cart: user.cart });
    }

    const subTotal = productPrice.price * quantity;

    updatedCart = [
      ...user.cart,
      { quantity, productId, subtotal: +subTotal.toFixed(2) },
    ];
    user.cart = updatedCart;
    const userTotal = user.cart.reduce(
      (acc, user) => acc + +user.subtotal.toFixed(2),
      0
    );
    user.total = +userTotal.toFixed(2);
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
    const productSubtotal = product.quantity * productPrice.price;
    product.subtotal = +productSubtotal.toFixed(2);

    const userTotal = user.cart.reduce(
      (acc, user) => acc + +user.subtotal.toFixed(2),
      0
    );
    user.total = +userTotal.toFixed(2);
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

    user.cart = newCart;
    const userTotal = user.cart.reduce(
      (acc, user) => acc + +user.subtotal.toFixed(2),
      0
    );
    user.total = +userTotal.toFixed(2);
    await user.save();
    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed' });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.userData.userId;

  try {
    const user = await User.findById(userId, { orders: 1 });

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed' });
  }
};

exports.getOrderDetails = async (req, res) => {
  const userId = req.userData.userId;
  const orderId = req.params.orderId;

  try {
    const user = await User.findById(userId, { orders: 1, _id: 0 }).populate(
      'orders.products.productId'
    );
    const order = user.orders.find(order => order._id == orderId);
    console.log(order);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: 'Failed' });
  }
};
