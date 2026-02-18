const {createProduct, getProducts, updateProduct, deleteProduct,getProductById} = require('../controllers/productController');
const exporess = require('express');
const router = exporess.Router();

router.post('/createProduct', createProduct);
router.get('/getProducts', getProducts);
router.get('/getProduct/:id', getProductById);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;
