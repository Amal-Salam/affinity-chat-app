require('dotenv').config({ debug: true });
const express = require('express');

const bodyparser= require('body-parser');

// database config link
const connectDB = require('./config/dbconfig');

const test=process.env.TEST
console.log(`test is ${test}`);

//importing routers
const Authentication = require(`./routes/authRoutes`);
const userRouter = require(`./routes/userRoutes`);
// const chatRouter = require(`${__dirname}/routes/chatRoutes`);
// const fileRouter = require(`${__dirname}/routes/fileRoutes`);

const app=express();
const PORT = process.env.PORT ||6100 ;

//middleware
app.use(bodyparser.json());

// database connection
connectDB();

//test route
app.get('/',(req,res) => {
    res.json({message:'This is to test '})
})

//Mounting the routes
app.use('/api/auth', Authentication);
app.use('/api/users',userRouter);
// app.use('/api/chats',chatRouter);
// app.use('/api/files',fileRouter);


app.listen(PORT, () => {
 console.log(`Server is listening on port ${PORT}`);
});


