import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const authenticate = async (req, res, next) => {
  
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
