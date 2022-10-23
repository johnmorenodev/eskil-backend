const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoriesSchema = Schema({
  categoryName: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Category', CategoriesSchema);
