const Category = require('../models/categories');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { products: 0 }).exec();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to get categories.' });
  }
};

exports.postCategories = async (req, res) => {
  const { categoryName, imageUrl, products } = req.body;
  try {
    const category = new Category({ categoryName, imageUrl, products });
    await category.save();
    return res.status(201).json({ category: category });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to add category.' });
  }
};

exports.getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categoryProducts = await Category.findById(categoryId, {
      products: 1,
      _id: 0,
    })
      .populate('products')
      .exec();
    return res.status(200).json(categoryProducts);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to get products.' });
  }
};
