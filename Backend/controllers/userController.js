// userController.js

const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select([
      'email',
      'username',
      'avatar',
      '_id',
    ]);
    return res.json(users);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation error and send a 400 Bad Request response
      res.status(400).json({ error: 'Validation error' });
    } else if (error.name === 'CastError') {
      // Handle cast error and send a 400 Bad Request response
      res.status(400).json({ error: 'Invalid ID format' });
    } else {
      // Handle other errors with a 500 Internal Server Error response
      res.status(500).json({ error: 'Internal server error' });
    }
    next(ex);
  }
};

exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatar = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarSet: true,
        avatar,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarSet,
      image: userData.avatar,
    });
  } catch (ex) {
    next(ex);
  }
};

// Get User Profile
exports.getUserProfile  = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you dont have user authentication middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server  yehaw error' });
  }
};

// Edit User Profile
exports.editUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you dont have user authentication middleware if you do,use req.user instead
    const updatedData = req.body; // Data to be updated
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server donkey error' });
  }
};

exports.profilePicture = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you dont have user authentication middleware
    const updatedData = req.body; // Data to be updated
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Delete User Account
exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you dont have user authentication middleware
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // You might want to perform additional cleanup, such as deleting associated chats, here
    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
