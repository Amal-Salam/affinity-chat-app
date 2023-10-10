const express = require('express');
const {
  viewChat,
  getChats,
  newGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require('../controllers/chatController');

const router = express.Router();


router.post('/' ,viewChat);
router.get( '/',getChats);
router.post('/group', newGroupChat);
router.put('/rename', renameGroup);
router.put('/groupexit', removeFromGroup);
router.put('/groupadd', addToGroup);

module.exports = router;
