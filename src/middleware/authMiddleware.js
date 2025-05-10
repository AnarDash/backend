// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user data to request object
    next();
  } catch (err) {
    return next(createHttpError(401, 'Invalid token'));
  }
};

module.exports = authenticate;