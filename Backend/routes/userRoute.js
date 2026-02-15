const {createUser,getUsers,updateUser,deleteUser,loginUser} = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/createUser', createUser);
router.get('/getUsers', getUsers);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/loginUser', loginUser);

module.exports = router;
