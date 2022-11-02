const Product = require('../models/productModel');

exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find(
      { isFeatured: true },
      { name: 1, price: 1, imgUrl: 1 }
    ).exec();
    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.log(error);
  }
};

exports.postFeaturedProducts = async (req, res) => {
  const { name, price, imgUrl } = req.body;
  try {
    const product = new Featured({ name, price, imgUrl });
    await product.save();
    res.status(201).json({ product: product });
  } catch (error) {
    console.log(error);
  }
};
