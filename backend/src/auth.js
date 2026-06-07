import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateAdminToken = () => {
  return jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

export const verifyAdminPassword = (password) => {
  return password === process.env.ADMIN_PASSWORD;
};
