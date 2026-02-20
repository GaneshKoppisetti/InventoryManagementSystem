const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    let { username, email, password, role, isActive } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

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
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email }).populate("role");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // 🔐 Generate JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role?.rolename },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role?.rolename
//       }
//     });

//   } catch (error) {
//     console.error("Error logging in user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email,isActive:true }).populate("role");
    //console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const roles = user.role.map(r => r.rolename);
    const permissions = user.role.map(r => ({
      role: r.rolename,
      permissions: Object.fromEntries(r.permissions)
    }));
    // Access Token (short life)
    const accessToken = jwt.sign(
      {
        id: user._id, username: user.username,
        email: user.email, roles, permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    //Refresh Token (long life)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "5m" }
    );

    // Save refresh token in DB (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      // sameSite: "strict",
      // maxAge: 7 * 24 * 60 * 60 * 1000, // one 7 days
      maxAge: 5 * 60 * 1000,
    });
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: false,
    //   // sameSite: "strict",
    //   // maxAge: 7 * 24 * 60 * 60 * 1000, // one 7 days
    //   maxAge:60 * 1000,
    // });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles,
        permissions
      }
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id).populate("role");
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const roles = user.role.map(r => r.rolename);
    const permissions = user.role.map(r => ({
      role: r.rolename,
      permissions: Object.fromEntries(r.permissions)
    }));

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        roles,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};


const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null }
  );

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
};





module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,
  refreshAccessToken,
  logoutUser
}
