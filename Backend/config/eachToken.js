const jwt = require('jsonwebtoken');

 const eachToken =(id) => {
 return jwt.sign({id}, process.env.JWT_SECRET, {
   expiresIn: '20d', // Token expiration time
 });
 };
module.exports = eachToken;
