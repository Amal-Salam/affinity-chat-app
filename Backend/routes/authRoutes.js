// authRoutes.js
const express = require('express');
const router = express.Router();
const {signup,login,logout,getAllUsers,} = require('../controllers/authController');
const { shield } = require('../middlewares/authMiddleware');

// User Registration
router.post('/signup', signup);

// User Login
router.post('/login', login);

// User Logout
router.post('/logout', logout);

router.route('/allusers').get(shield, getAllUsers);

module.exports = router;
