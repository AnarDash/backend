// backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGO_URL from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;