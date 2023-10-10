const mongoose = require('mongoose');

// This function connects to the MongoDB database using Mongoose.
const connectDB = async () => {
  

  try {
    // Disable strict query mode to allow more flexible querying.
    mongoose.set('strictQuery', false);

    // Connect to the MongoDB database using the URI from the environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });

    // If the connection is successful, log a success message.
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error during connection, log the error message and exit the application with an error code.
    console.error(`Error connecting to the database: ${error.message}`);
    
  }
};

module.exports = connectDB;

