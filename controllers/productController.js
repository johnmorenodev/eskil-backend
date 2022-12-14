const Product = require('../models/productModel');
const Category = require('../models/categories');

//GET PRODUCTS ON PRODUCT PAGE
exports.getProductById = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).exec();
    const categoryId = product.categories[0];

    const relatedProducts = await Category.findById(categoryId, {
      products: 1,
    })
      .populate({
        path: 'products',
        select: 'name price imgUrl',
        match: { _id: { $ne: product._id } },
      })
      .exec();
    const filtered = [...relatedProducts.products];
    while (filtered.length > 3) {
      filtered.pop();
    }

    return res
      .status(200)
      .json({ product: product, relatedProducts: filtered });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to get products.' });
  }
};

//ADD PRODUCTS
exports.postProduct = async (req, res, next) => {
  const {
    name,
    price,
    imgUrl,
    isFeatured,
    shortDescription,
    longDescription,
    categories,
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
      categories,
      details,
      addInfo,
    });

    await product.save();
    const operation = product.categories.map(category => {
      return {
        updateOne: {
          filter: { _id: category },
          update: { $push: { products: product } },
        },
      };
    });

    await Category.bulkWrite(operation);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to add product.' });
  }
};

//UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  const { id, categories } = req.body;
  try {
    const result = await Product.findOneAndUpdate(
      { _id: id },
      { categories: categories }
    );

    await Category.findOneAndUpdate(
      { _id: categories[0] },
      { $push: { products: id } }
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update product.' });
  }
};

//GET FEATURED PRODUCTS ON HOME PAGE
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find(
      { isFeatured: true },
      { name: 1, price: 1, imgUrl: 1 }
    ).exec();
    return res.status(200).json(featuredProducts);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to get featured product.' });
  }
};
