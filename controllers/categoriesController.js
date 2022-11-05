const Category = require('../models/categories');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { products: 0 }).exec();
    return res.status(200).json({ categories: categories });
  } catch (error) {
    console.log(error);
  }
};

exports.postCategories = async (req, res) => {
  const { categoryName, imageUrl, products } = req.body;
  try {
    const category = new Category({ categoryName, imageUrl, products });
    await category.save();
    res.status(201).json({ category: category });
  } catch (error) {
    console.log(error);
  }
};
