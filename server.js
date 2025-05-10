const express = require('express');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/userRoute');
const loanRoutes = require('./src/routes/loanRoute');
const errorHandler = require('./src/middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Loan Management System API!');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Error handler middleware (must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));