const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CartItemsSchema = Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

const OrderItemsSchema = Schema([
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    totalPrice: { type: Number },
    purchaseDate: { type: Date, default: new Date() },
  },
]);

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [CartItemsSchema],
  orders: [OrderItemsSchema],
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
