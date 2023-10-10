const express = require('express');
const {sendMessage,allMessage,} = require('../controllers/messageController');


const router = express.Router();

router.post('/', sendMessage);
router.get('/:chatId', allMessage);

module.exports = router;
