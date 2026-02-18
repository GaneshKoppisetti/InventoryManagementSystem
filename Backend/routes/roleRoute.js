const {createRole, getRoles, updateRole, deleteRole,getRoleById} = require('../controllers/roleController');
const express = require('express');
const router = express.Router();

router.post('/createRole', createRole);
router.get('/getRoles', getRoles);
router.get('/getRole/:id', getRoleById);
router.put('/updateRole/:id', updateRole);
router.delete('/deleteRole/:id', deleteRole);

module.exports = router;
