const { createUser, getUsers, updateUser, deleteUser, getUserById, loginUser, refreshAccessToken, logoutUser } = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.post('/createUser', verifyToken, checkPermission("Users", "Write"), createUser);
router.get('/getUsers', verifyToken, checkPermission("Users", "Read"), getUsers);
router.get('/getUser/:id', verifyToken, checkPermission("Users", "Read"), getUserById);
router.put('/updateUser/:id', verifyToken, checkPermission("Users", "Update"), updateUser);
router.delete('/deleteUser/:id', verifyToken, checkPermission("Users", "Delete"), deleteUser);
router.post('/loginUser', loginUser);
router.post('/refreshAccessToken', refreshAccessToken)
router.post('/logOutUser', logoutUser)

module.exports = router;
