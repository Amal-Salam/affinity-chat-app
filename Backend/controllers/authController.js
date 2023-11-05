// authController.js
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const eachToken = require("../config/eachToken");


//User Sign up
exports.signup = asyncHandler(async (req, res) => {
  
    const { firstname,lastname,username, email, password, avatar } = req.body;
     
    if(!username || !email || !password){
        res.status(400);
        throw new Error("NOTE : All fields are required");
      }
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser){
      res.status(400);
      throw new Error("This Email Already Exists in Our System")
    } 
    // The hashed password,before it is saved to db,will later implement forgot password modals.
    const hashedPassword = await bcrypt.hash(password, 10);

    //creates and saves the user to the database
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password:hashedPassword,
      avatar,

    });

    
    // Return the token and any other user-related data as needed
    if(user){
    res.status(201).json({ 
              _id: user._id,
              firstname:user.firstname,
              lastname :user.lastname,
              username: user.username,
              email:user.email,
              avatar:user.avatar,
              token:eachToken(user._id), 
            });
  } else {
    console.error(error);
    res.status(400);
    throw new Error("Unable to create User");
   
  }
});

//User Login
exports.login = asyncHandler(async (req, res) => {
 try{
    const { email, password } = req.body;
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

    
    // Return the token and any other user-related data as needed
    res.status(200).json({
          _id: user._id,
           username: user.username ,
           email:user.email,
           avatar:user.avatar,
           token:eachToken(user._id)});

    console.log(`Welcome ${user.username}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//User Logout
exports.logout = (req, res) => {
  try{
  // Here, you would typically invalidate the JWT token on the client-side.
  res.setHeader('Content-Type', 'application/json');
  res.clearCookie('token'); 
  
 res.json({ message: 'Logged out successfully' }); 
 res.redirect('/login');
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

//all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ?{
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // if (users !== null) {
  //   console.log(`Test ${user._id}`);
  //   // The query returned at least one user.
  //   // You can now access the `_id` property.
  // } else {
  //   console.log('problem'); // The query did not return any users.
  //   // You can handle this case as needed.
  // }

  res.send(users);
});


