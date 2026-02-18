const {createUser,getUsers,updateUser,deleteUser,getUserById,loginUser} = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUserById);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/loginUser', loginUser);

module.exports = router;
