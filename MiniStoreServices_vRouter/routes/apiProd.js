const express = require('express');
const router = express.Router();


const productController = require('../controllers/products');

router.post('/products',  productController.createProduct);
router.put('/products/:id',  productController. updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/:id',  productController.getProduct);
router.get('/products/q/:term',  productController.getProductsByTerm);
router.get('/products',  productController.getProducts);

module.exports = router;