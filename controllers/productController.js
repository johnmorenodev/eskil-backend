const Product = require('../models/productModel');

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).exec();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

exports.postProduct = async (req, res, next) => {
  const {
    name,
    price,
    imgUrl,
    isFeatured,
    shortDescription,
    longDescription,
    details,
    addInfo,
  } = req.body;

  try {
    const product = new Product({
      name,
      price,
      imgUrl,
      isFeatured,
      shortDescription,
      longDescription,
      details,
      addInfo,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
  }
};
