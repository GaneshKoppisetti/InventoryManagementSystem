const {createUser,getUsers,updateUser,deleteUser,getUserById,loginUser,refreshAccessToken,logoutUser} = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.post('/createUser', createUser);
router.get('/getUsers',verifyToken,checkPermission("Users", "Read"), getUsers);
router.get('/getUser/:id', getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/loginUser', loginUser);
router.post('/refreshAccessToken',refreshAccessToken)
router.post('/logOutUser',logoutUser)

module.exports = router;
