
const express = require('express');
const router = express.Router();
const {getUserProfile, editUserProfile, profilePicture, deleteUserAccount,getAllUsers,setAvatar} = require('../controllers/userController');


router.get('/allusers', getAllUsers);
router.post('/setavatar/:id', setAvatar);
// Get User profile
 router.get('/profile/:id', getUserProfile);

//Edit User profile
 router.put('/profile/:id', editUserProfile);

//Edit User profile Picture
 router.put('/setavatar/:id', profilePicture);

//Delete Account
 router.delete('/delete/:id', deleteUserAccount);

module.exports = router;
