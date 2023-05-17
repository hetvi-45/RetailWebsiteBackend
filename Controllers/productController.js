const { validationResult } = require('express-validator');
const Product = require('../Models/product');
const HttpError = require('../Models/http-error');
const { v4: uuidv4 } = require('uuid');

const getProducts = async (req, res, next) => {
    let products;
    try {
        products = await Product.find({});
    } catch (err) {
      const error = new HttpError(
        'Fetching products failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json(products.map(p => p.toObject({ getters: true })));
  };

  const addProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const {  name, description, price, count, quantity, imageUrl } = req.body;
  
    let existingProduct
    try {
      existingProduct = await Product.findOne({ name: name })
    } catch (err) {
      const error = new HttpError(
        'Creating Product failed, please try again later.',
        500
      );
      return next(error);
    }
    
    if (existingProduct) {
      const error = new HttpError(
        'Product exists already.',
        422
      );
      return next(error);
    }
    
    const createdProduct = new Product({
      name,
      description,
      count,
      price,
      quantity,
      imageUrl
    });
  
    try {
      await createdProduct.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Product Failed',
        500
      );
      return next(error);
    }
  
    res.status(201).json({product: createdProduct.toObject({ getters: true })});
  };

  const updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const name = req.body.name;
    const description = req.body.description;
    const imageUrl = req.body.image;
    const price = req.body.price;
    const count = req.body.count;
    const quantity = req.body.quantity;
    
   
    const productId = req.params.pid;
  
    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update product.',
        500
      );
      return next(error);
    }
  
    product.name = name;
    product.description = description;
    product.count = count;
    product.price = price;
    product.imageUrl = imageUrl;
    product.quantity = quantity;

    try {
      await product.save();
    } catch (err) {
      // console.log(err);
      // const error = new HttpError(
      //   'Something went wrong, could not update product.',
      //   500
      // );
      return next(err);
    }
  
    res.status(200).json({ product: product.toObject({ getters: true }) });
  }; 

  const deleteProduct = async (req, res, next) => {
    const productId = req.params.pid;
    let product;
    try {
      product = await Product.findById(productId);
    //   console.log(user);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete product.',
        500
      );
      return next(error);
    }
  
    if (!product) {
      const error = new HttpError('Could not find product for this id.', 404);
      return next(error);
    }
  
    try {
      
      await Product.findByIdAndRemove(productId);
      
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete product.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted product.' });
  };

exports.getProducts = getProducts;
exports.addProduct = addProduct;
exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;