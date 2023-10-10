const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

/*
 * sendMessage - send Message
 */
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  console.log(req.body);

  if (!content || !chatId) {
    console.log('Invalid data passed to request');
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.params._id,
    content: content,
    chatId: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'username avatar');
    message = await message.populate('chat','chatId');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'username avatar email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/*
 * allMessage - get all Messages
 */
exports.allMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username avatar email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};


