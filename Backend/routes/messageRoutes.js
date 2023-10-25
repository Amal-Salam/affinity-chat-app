const express = require('express');
const {sendMessage,allMessage,} = require('../controllers/messageController');
const { shield } = require('../middlewares/authMiddleware');


const router = express.Router();

router.route("/").post(shield, sendMessage);
router.route('/:chatId').get(shield, allMessage);

module.exports = router;
