const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive)
      return res.status(401).json({ message: 'Account disabled' });
    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access only' });
  next();
};

const vendorOrAdmin = (req, res, next) => {
  if (!['vendor','admin'].includes(req.user?.role))
    return res.status(403).json({ message: 'Vendor or Admin access only' });
  next();
};

module.exports = { protect, adminOnly, vendorOrAdmin };
