const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token){
      return res.status(401).json({
        message: 'Access token is required',
        error:   'MISSING_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.get(decoded.id);

    if (!user){
      return res.status(401).json({
        message: 'Invalid token - user not found',
        error:   'USER_NOT_FOUND'
      });
    }

    if (!user.is_active){
      return res.status(401).json({
        message: 'Account is deactivated',
        error:   'ACCOUNT_DEACTIVATED'
      });
    }

    req.user = user;
    next();
  } catch (error){
    if (error.name === 'TokenExpiredError'){
      return res.status(401).json({
        message: 'Token has expired',
        error:   'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError'){
      return res.status(401).json({
        message: 'Invalid token',
        error:   'INVALID_TOKEN'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'Authentication error',
      error:   'AUTH_ERROR'
    });
  }
};

// Check whether the user has one of the required roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user){
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)){
      return res.status(403).json({
        message:  'Insufficient permissions',
        required: allowedRoles,
        current:  userRole
      });
    }

    next();
  };
};

const requireAdmin = requireRole(['admin']);
const requireModerator = requireRole(['admin', 'moderator']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireModerator
};
