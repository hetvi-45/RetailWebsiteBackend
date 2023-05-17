const express = require('express');
const { check } = require('express-validator');

const usersController = require('../Controllers/userController');
const verifyToken = require('../verifyToken');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
    '/signup',
    [
      check('email')
        .normalizeEmail() // Test@test.com => test@test.com
        .isEmail(),
      check('password').isLength({ min: 6 }),
      check('type').not().isEmpty()
    ],
    usersController.signup
  );
router.post('/login', usersController.login);

router.patch(
    '/:uid',
    verifyToken,
    usersController.updateUser
  );
  router.delete(
    '/:uid',
    verifyToken,
    usersController.deleteUser
  );

module.exports = router;
