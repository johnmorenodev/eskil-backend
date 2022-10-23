const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FeaturedSchema = Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true },
});

module.exports = mongoose.model('Feature', FeaturedSchema);
