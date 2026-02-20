const Role = require('../models/role');

const createRole = async (req, res) => {
  try {
    const { rolename, description, permissions, isActive } = req.body;
    if (await Role.findOne({ rolename })) {
      return res.status(400).json({ error: 'Role Name already exists' });
    }
    const newRole = new Role({ rolename, description, permissions, isActive });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rolename, description, permissions, isActive } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { rolename, description, permissions, isActive },
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
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleById
};
