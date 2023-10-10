// authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT generation

const jwtSecretKey='MySecretKeys'

//User Sign up
exports.signup = async (req, res) => {
  try {
    const { firstname,lastname,username, email, password, avatar } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, jwtSecretKey, {
      expiresIn: '30m', // Token expiration time
    });

    // Return the token and any other user-related data as needed
    res
      .status(201)
      .json({ userId: newUser._id, firstname,lastname,username: newUser.username,email,avatar,token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

//User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email details' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password details' });
    }

    // Password is valid, generate a JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: '4h', // Token expiration time ie the user will be logged out after this time elapses.
    });

    // Return the token and any other user-related data as needed
    res.status(200).json({userId: user._id,username: user.username ,token});
    console.log(`Welcome ${user.username}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

//User Logout
exports.logout = (req, res) => {
  try{
  // Here, you would typically invalidate the JWT token on the client-side.
  res.clearCookie('token'); 
  
 res.json({ message: 'Logged out successfully' }); 
 res.redirect('/login');
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

