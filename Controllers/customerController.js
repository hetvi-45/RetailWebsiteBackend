const { validationResult } = require('express-validator');
const Customer = require('../Models/customer');
const Product = require('../Models/product');
const Order = require('../Models/order');
const HttpError = require('../Models/http-error');
const { v4: uuidv4 } = require('uuid');

const createCustomer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const {  name, email, phoneNo, address, birthDate, cart } = req.body;
  
    let existingCustomer
    try {
      existingCustomer = await Customer.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Creating Customer failed, please try again later.',
        500
      );
      return next(error);
    }
    
    if (existingCustomer) {
      const error = new HttpError(
        'Customer exists already.',
        422
      );
      return next(error);
    }
    
    const createdCustomer = new Customer({
      name,
      email,
      address,
      birthDate,
      phoneNo,
      cart,
    });
  
    try {
      await createdCustomer.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Customer Failed',
        500
      );
      return next(err);
    }
  
    res.status(201).json({customer: createdCustomer.toObject({ getters: true })});
  };

  const getCustomers = async (req, res, next) => {
    let customers;
    try {
      customers = await Customer.find({});
    } catch (err) {
      const error = new HttpError(
        'Fetching customers failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json(customers.map(customer => customer.toObject({ getters: true })));
  };   

  const updateCustomer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { name, email, phoneNo, birthDate, address, cart } = req.body;
    const customerId = req.params.cid;
  
    let customer;
    try {
      customer = await Customer.findById(customerId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update customer.',
        500
      );
      return next(error);
    }
    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.phoneNo = phoneNo;
    customer.birthDate = birthDate;
    customer.cart = cart

    try {
      await customer.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update customer.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ customer: customer.toObject({ getters: true }) });
  };

  const deleteCustomer = async (req, res, next) => {
    const customerId = req.params.cid;
    let customer;
    try {
      customer = await Customer.findById(customerId);
    //   console.log(user);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete customer.',
        500
      );
      return next(error);
    }
  
    if (!customer) {
      const error = new HttpError('Could not find customer for this id.', 404);
      return next(error);
    }
  
    try {
      
      await Customer.findByIdAndRemove(customerId);
      
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete customer.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted customer.' });
  };

  const getCustomerById = async (req, res, next) => {
    const customerId = req.params.cid;
  
    let customer;
    try {
        customer = await Customer.findById(customerId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a customer.',
        500
      );
      return next(error);
    }
  
    if (!customer) {
      const error = new HttpError(
        'Could not find a customer for the provided id.',
        404
      );
      return next(error);
    }
  
    res.json(customer.toObject({ getters: true }));
  };

  const addToCart = async (req, res, next) => {
    const cart = req.body
    const customerId = req.params.cid;
    let customer;
    try {
        customer = await Customer.findById(customerId);
    } catch (err) {
      return next(err);
    }
  
    if (!customer) {
      const error = new HttpError(
        'Could not find a customer for the provided id.',
        404
      );
      return next(error);
    }
    customer.cart.push(cart);
    try {
      await customer.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update customer.',
        500
      );
      return next(error);
    }
  
    res.status(200).json(customer.toObject({ getters: true }));
    // let product;
    // try{
    //   product = await Product.findById(productId);
    // } catch(err){
    //   return next(err);
    // }

    // if(!product){
    //   const error = new HttpError(
    //     'Could not find a customer for the provided id.',
    //     404
    //   );
    //   return next(error);
    // }


  }

  const deleteFromCart = async (req, res, next) => {
    const deletedProduct = req.body.id;
    const customerId = req.params.cid;
    let result;
    try{
      result = await Customer.findOneAndUpdate({_id: customerId}, {$pull: {cart: {id: deletedProduct}}}, {new: true});
    } catch(error) {
      return next(error);
    }
    if(!result){
      const error = new HttpError(
        'Could not find a customer for the provided id.',
        404
      );
      return next(error);
    }
    res.json(result.toObject({getters: true}));

  }

  const getOrders = async (req, res, next) => {
    let orders;
    try {
      orders = await Order.find({});
    } catch (err) {
      const error = new HttpError(
        'Fetching orders failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json(orders.map(order => order.toObject({ getters: true })));
  };   

  const addOrder = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const {  custId, name, email, phoneNo, address, orderedProduct, date, total  } = req.body;
  
    let order
    // try {
    //   order = await Order.findOne({ email: email, orderedProduct: orderedProduct })
    // } catch (err) {
    //   const error = new HttpError(
    //     'Creating Order failed, please try again later.',
    //     500
    //   );
    //   return next(error);
    // }
    
    // if (order) {
    //   const error = new HttpError(
    //     'Order added already.',
    //     422
    //   );
    //   return next(error);
    // }
    
    const neworder = new Order({
      custId,
      name,
      email,
      address,
      phoneNo,
      orderedProduct,
      date,
      total
    });
  
    try {
      await neworder.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Order Failed',
        500
      );
      return next(err);
    }
  
    res.status(201).json(neworder.toObject({ getters: true }));
  }

  const getOrderById = async (req, res, next) => {
    const orderId = req.params.oid;
  
    let order;
    try {
        order = await Order.findById(orderId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a order.',
        500
      );
      return next(error);
    }
  
    if (!order) {
      const error = new HttpError(
        'Could not find a order for the provided id.',
        404
      );
      return next(error);
    }

    let customer;
    try{
      customer = await Customer.findById(order.custId); 
    } catch(error){
      return next(error);
    }
    if(!customer){
      const error = new HttpError('Could not find customer.');
      return next(error);
    }
    let product;
    customer.cart.forEach(async (p) => {
      try{
        product = await Product.findByIdAndUpdate(p._id, {count: (p.count - p.quantity)});
      } catch(error){
        console.log(error);
        return next(error);
      }
    })
    customer.cart = [];
    try{
      await customer.save();
    } catch(error){
      return next(error);
    }
  
    res.json(order.toObject({ getters: true }));
  }

  const deleteOrder = async (req, res, next) => {
    const orderId = req.params.oid;
    let order;
    try {
      order = await Order.findById(orderId);
    //   console.log(user);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete order.',
        500
      );
      return next(error);
    }
  
    if (!order) {
      const error = new HttpError('Could not find order for this id.', 404);
      return next(error);
    }
  
    try {
      
      await Order.findByIdAndRemove(orderId);
      
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete customer.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted order.' });
  };

  exports.createCustomer = createCustomer;
  exports.getCustomers = getCustomers;
  exports.deleteCustomer = deleteCustomer;
  exports.updateCustomer = updateCustomer;
  exports.getCustomerById = getCustomerById;
  exports.addToCart = addToCart;
  exports.deleteFromCart = deleteFromCart;
  exports.addOrder = addOrder;
  exports.getOrderById = getOrderById;
  exports.getOrders = getOrders;
  exports.deleteOrder = deleteOrder;