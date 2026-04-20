const { createRole, getRoles, updateRole, deleteRole, getRoleById } = require('../controllers/roleController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');


router.post('/createRole', verifyToken, checkPermission("Roles", "Write"), createRole);
router.get('/getRoles', verifyToken, checkPermission("Roles", "Read"), getRoles);
router.get('/getRole/:id', verifyToken, checkPermission("Roles", "Read"), getRoleById);
router.put('/updateRole/:id', verifyToken, checkPermission("Roles", "Update"), updateRole);
router.delete('/deleteRole/:id', verifyToken, checkPermission("Roles", "Delete"), deleteRole);

module.exports = router;
