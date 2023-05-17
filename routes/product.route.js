const express = require('express');
const { check } = require('express-validator');

const productsController = require('../Controllers/productController');
const verifyToken = require('../verifyToken');

const router = express.Router();

router.get('/', verifyToken,  productsController.getProducts);

router.post('/',
    [
        check('name')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('price')
            .not()
            .isEmpty(),
        check('count')
            .not()
            .isEmpty(),
        check('imageUrl')
            .not()
            .isEmpty()
    ],
    verifyToken,
    productsController.addProduct);

    router.patch('/:pid',
    verifyToken,
    productsController.updateProduct);

    router.delete('/:pid', verifyToken, productsController.deleteProduct);

module.exports = router;