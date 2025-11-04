const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({
        message: 'Validation failed',
        errors:  errors.array()
      });
    }

    const { username, email, password, firstName, lastName, role } = req.body;

    const existingUserByEmail = await User.existsByEmail(email);
    const existingUserByUsername = await User.existsByUsername(username);

    if (existingUserByEmail){
      return res.status(409).json({
        message: 'User already exists with this email'
      });
    }

    if (existingUserByUsername){
      return res.status(409).json({
        message: 'User already exists with this username'
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user:    {
        id:        newUser.id,
        username:  newUser.username,
        email:     newUser.email,
        firstName: newUser.first_name,
        lastName:  newUser.last_name,
        role:      newUser.role
      }
    });

  } catch (error){
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error:   error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({
        message: 'Validation failed',
        errors:  errors.array()
      });
    }

    const { emailOrUsername, password } = req.body;

    const user = await User.getByEmailOrUsername(emailOrUsername);

    if (!user){
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    if (!user.is_active){
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    const isValidPassword = await User.verifyPassword(password, user.password);

    if (!isValidPassword){
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    await User.updateLastLogin(user.id);

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user:    {
        id:        user.id,
        username:  user.username,
        email:     user.email,
        firstName: user.first_name,
        lastName:  user.last_name,
        role:      user.role
      },
      token
    });

  } catch (error){
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error:   error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id:        user.id,
        username:  user.username,
        email:     user.email,
        firstName: user.first_name,
        lastName:  user.last_name,
        role:      user.role,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    });
  } catch (error){
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to get profile',
      error:   error.message
    });
  }
};

// Logout (client-side token removal)
// Note: Since JWT is stateless, logout is handled on the client side by removing the token. -RKS
const logout = (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};
