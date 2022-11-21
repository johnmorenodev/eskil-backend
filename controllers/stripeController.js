const stripe = require('stripe')(process.env.STRIPE);
const User = require('../models/userModel');
const bodyParser = require('body-parser');

const endpointSecret = process.env.WEBHOOK;

exports.postCheckout = async (req, res) => {
  const userId = req.userData.userId;

  try {
    const user = await User.findById(userId, { cart: 1, orders: 1 }).populate(
      'cart.productId'
    );

    const newCart = await Promise.all(
      user.cart.map(async product => {
        const products = await stripe.products.create({
          name: product._id.toString(),

          images: [product.productId.imgUrl],
        });
        const price = await stripe.prices.create({
          product: products.id,
          unit_amount: product.productId.price * 100,
          currency: 'usd',
        });
        const obj = { price: price.id, quantity: product.quantity };
        return obj;
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: newCart,
      mode: 'payment',
      client_reference_id: userId,
      success_url: process.env.FRONT_END_URL,
      cancel_url: process.env.FRONT_END_URL + '/my-account',
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(400).json({ message: 'Failed' });
  }
};

exports.postWebhook = async (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items'],
        }
      );

      const customer = sessionWithLineItems.client_reference_id;

      if (session.payment_status === 'paid') {
        const user = await User.findById(customer);

        const userCart = [...user.cart];
        const userTotal = +user.total.toFixed(2);
        user.orders.unshift({
          products: [...userCart],
          totalPrice: +userTotal.toFixed(2),
        });
        user.cart = [];
        user.total = 0;
        await user.save();
      }

      break;
    }
  }

  response.status(200).end();
};
