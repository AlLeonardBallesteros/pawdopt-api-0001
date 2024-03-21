const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

//log in user
const login = async (req, res) => {
  const {email, password, role} = req.body;

  try {
    const user = await User.login(email, password, role);

    const token = createToken(user._id);
  
    res.status(200).json({email, token, role: user.role, id: user._id});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

//register user
const register = async (req, res) => {
  const {firstname, lastname, email, password} = req.body;
  const { id } = req.params;

  try {
    const user = await User.register(firstname, lastname, email, password);

    const token = createToken(user._id);

    res.status(200).json({email, token, id});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

//edit user admin only
const editUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, password, role } = req.body;

  try {
    // Update user details
    const user = await User.findByIdAndUpdate(id, { firstname, lastname, email, password, role }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


//delete user admin only
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


//get all user admin only
const getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

//verifying user admin side

const toggleUserVerification = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { verified }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



//user side check if account is verified

 const checkVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified} = req.body;

    const user = await User.findById(id, verified);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the verification status
    res.status(200).json({ verified: user.verified });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Store the received token in the user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send an email with the reset link (You need to implement this part)

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired" });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {login, register, editUser, deleteUser, getAllUsers, toggleUserVerification, checkVerification, newPassword, forgotPassword};
