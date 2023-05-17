const { validationResult } = require('express-validator');
const User = require('../Models/user');
const HttpError = require('../Models/http-error');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const config = require('../config');

const getUsers = async (req, res, next) => {
    let users;
    try {
      users = await User.find({});
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json(users.map(user => user.toObject({ getters: true })));
  };

  const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const {  email, password, type } = req.body;
  
    let existingUser
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
    
    if (existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      );
      return next(error);
    }
    
    const createdUser = new User({
      email,
      password,
      type,
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json(createdUser.toObject({ getters: true }));
  };
  
  const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    let existingUser;
  
    try {
      existingUser = await User.findOne({ email: email, password: password })
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!existingUser || existingUser.password !== password) {
      const error = new HttpError(
        'Invalid credentials, could not log you in.',
        401
      );
      return next(error);
    }
    
    const token = jwt.sign({ userId: existingUser.id, type: existingUser.type }, config.secretKey, {
      expiresIn: config.tokenExpiration,
    });

    res.json({user: existingUser.toObject({getters: true}), token: token});
  };

  const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { email, password, type } = req.body;
    const userId = req.params.uid;
  
    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update place.',
        500
      );
      return next(error);
    }
  
    user.email = email;
    user.password = password;
    user.type = type;

    try {
      await user.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update place.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ user: user.toObject({ getters: true }) });
  };

  const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
      user = await User.findById(userId);
      console.log(user);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete user.',
        500
      );
      return next(error);
    }
  
    if (!user) {
      const error = new HttpError('Could not find user for this id.', 404);
      return next(error);
    }
  
    try {
      
      await User.findByIdAndRemove(userId);
      
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete user.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted user.' });
  };
  
  exports.getUsers = getUsers;
  exports.signup = signup;
  exports.login = login;
  exports.updateUser = updateUser;
  exports.deleteUser = deleteUser;
