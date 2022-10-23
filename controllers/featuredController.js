const Featured = require('../models/indexPage/featured');

exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Featured.find({}).exec();
    console.log(featuredProducts);
    return res.status(200).json({ products: featuredProducts });
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
