const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    let { username, email, password, role, isActive } = req.body;

    if (!role) {
      const defaultRole = await Role.findOne({ name: "staff" }).select('_id');
      role = defaultRole?._id;
    }

    let saltedPWD = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedPWD);
    const newUser = new User({ username, email, password: hashedPassword, role, isActive });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, isActive } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password, role, isActive },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndUpdate(id, { isActive: false });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role?.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role?.name
      }
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser 
}
