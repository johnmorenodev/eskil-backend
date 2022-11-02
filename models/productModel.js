const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true },
  isFeatured: { type: Boolean },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  details: {
    variant: String,
    baseColor: String,
    baseMaterial: String,
    baseType: String,
    seatFinish: String,
    seatMaterial: String,
    height: String,
    width: String,
    depth: String,
    seatHeight: String,
  },
  addInfo: {
    style: String,
    warranty: String,
    brand: String,
    set: String,
    weight: String,
    delivery: String,
    variant: String,
    material: String,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
