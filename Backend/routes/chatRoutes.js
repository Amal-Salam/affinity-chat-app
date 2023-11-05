const express = require('express');
const {
  viewChat,
  getChats,
  newGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require('../controllers/chatController');
const { shield } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post( shield,viewChat);
router.route('/').get( shield,getChats);
router.route('/group').post(shield, newGroupChat);
router.route('/rename').put(shield, renameGroup);
router.route('/groupexit').put(shield, removeFromGroup);
router.route('/groupadd').put(shield, addToGroup);

module.exports = router;
