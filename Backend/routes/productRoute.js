const { createProduct, getProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const exporess = require('express');
const router = exporess.Router();
const verifyToken = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');


router.post('/createProduct', verifyToken, checkPermission("Products", "Write"), createProduct);
router.get('/getProducts', verifyToken, checkPermission("Products", "Read"), getProducts);
router.get('/getProduct/:id', verifyToken, checkPermission("Products", "Read"), getProductById);
router.put('/updateProduct/:id', verifyToken, checkPermission("Products", "Update"), updateProduct);
router.delete('/deleteProduct/:id', verifyToken, checkPermission("Products", "Delete"), deleteProduct);

module.exports = router;
