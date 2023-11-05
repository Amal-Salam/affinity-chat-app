// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isAvatarSet: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String, // You can store the URL to the user's profile picture here
  },
  status: {
    type: String,
  },
  // You can add more fields to the user schema as needed, such as a list of friends, settings, etc.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
