require('dotenv').config({ debug: true });
const express = require('express');

// const bodyparser= require('body-parser');
const cors = require('cors');
// database config link
const connectDB = require('./config/dbconfig');

//importing routers
const Authentication = require(`./routes/authRoutes`);
const userRouter = require(`./routes/userRoutes`);
const chatRouter = require(`./routes/chatRoutes`);
const messageRouter = require(`./routes/messageRoutes`);

const app=express();
const PORT =process.env.PORT ||6100 ;
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies)
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));
// database connection
connectDB();

//test route
app.get('/',(req,res) => {
    res.json({message:'This is to test '})
})

//Mounting the routes
app.use('/api/auth', Authentication);
app.use('/api/users',userRouter);
app.use('/api/chats',chatRouter);
app.use('/api/messages',messageRouter);


app.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});

const server = app.listen(
  5000,
  console.log(`Server started on PORT ${PORT}`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000, //closes connection when it stays ideal for 60sec/1min
  cors: {
    origin: ['http://localhost:3000','http://127.0.0.1:3000']
  },
});

io.on('connection', (socket) => {
  console.log('User ${socket.id} connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log('UserId: ', userData._id);
    socket.emit('connected');
  });

  socket.on('msgFromClient',(from,msg) =>{
    console.log('Message is '+from,msg);
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined room: ', room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message received', newMessageRecieved);
    });
  });

  // socket.off("setup", () => {
  // 	console.log("USER DISCONNECTED");
  // 	socket.leave(userData._id);
  // });
});
