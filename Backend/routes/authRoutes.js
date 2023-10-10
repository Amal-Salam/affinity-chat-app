// authRoutes.js
const express = require('express');
const router = express.Router();
const {signup,login,logout} = require('../controllers/authController');

// User Registration
router.post('/signup', signup);

// User Login
router.post('/login', login);

// User Logout
router.post('/logout', logout);

module.exports = router;
