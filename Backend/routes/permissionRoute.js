const {createPermission, getPermissions , updatePermission, deletePermission} = require('../controllers/permissionController');
const express = require('express');
const router = express.Router();

router.post('/createPermission', createPermission);
router.get('/getPermissions', getPermissions);
router.put('/updatePermission/:id', updatePermission);
router.delete('/deletePermission/:id', deletePermission);

module.exports = router;
