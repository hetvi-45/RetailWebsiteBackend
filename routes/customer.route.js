const express = require('express');
const { check } = require('express-validator');

const customerController = require('../Controllers/customerController');
const verifyToken = require('../verifyToken');

const router = express.Router();

router.get('/', verifyToken, customerController.getCustomers);

// router.get('/:cid', verifyToken ,customerController.getCustomerById);

router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail() // Test@test.com => test@test.com
            .isEmail(),
    ],
    verifyToken,
    customerController.createCustomer);

    router.patch('/:cid',
    verifyToken,
    customerController.updateCustomer);

    router.patch('/addtocart/:cid', verifyToken, customerController.addToCart);

    router.patch('/deletecart/:cid', verifyToken, customerController.deleteFromCart);

    router.delete('/:cid', verifyToken, customerController.deleteCustomer);

    router.get('/order', verifyToken, customerController.getOrders);

    router.post('/order', verifyToken, customerController.addOrder);

    router.get('/order/:oid', verifyToken, customerController.getOrderById);

    router.delete('/order/:oid', verifyToken, customerController.deleteOrder);

module.exports = router;