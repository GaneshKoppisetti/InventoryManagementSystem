const Role = require('../models/role');

const createRole = async (req, res) => {
  try {
    const { name, description, permissions,isActive } = req.body;
    const newRole = new Role({ name, description, permissions, isActive });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, isActive } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, description, permissions, isActive },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndUpdate(id, { isActive: false });
    if (!deletedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRole,
  deleteRole
};
