const Permission = require('../models/permission');

const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPermission = new Permission({ name, description });
    await newPermission.save();
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { name, description, isActive },
      { new: true }
    );
    if (!updatedPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.status(200).json(updatedPermission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPermission = await Permission.findByIdAndUpdate(id, { isActive: false });
    if (!deletedPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission
};
