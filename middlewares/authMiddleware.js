const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    // Get the token from headers or cookies (or wherever it's stored)
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in Authorization header (Bearer token)
    
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(500).json({ message: 'Error verifying admin role', error: err.message });
  }
};

module.exports = isAdmin;
