const User = require('../models/User');
const { generateToken, validateEmail, formatResponse } = require('../utils/helpers');

class AuthController {
  // Register
  async register(req, res) {
    try {
      const { firstName, lastName, email, password, passwordConfirm } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json(formatResponse('error', 'All fields are required'));
      }

      if (!validateEmail(email)) {
        return res.status(400).json(formatResponse('error', 'Invalid email format'));
      }

      if (password !== passwordConfirm) {
        return res.status(400).json(formatResponse('error', 'Passwords do not match'));
      }

      if (password.length < 6) {
        return res.status(400).json(formatResponse('error', 'Password must be at least 6 characters'));
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json(formatResponse('error', 'Email is already registered'));
      }

      // Create user
      const user = new User({
        firstName,
        lastName,
        email,
        password
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json(formatResponse('success', 'Registration successful', {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: user.fullName
        }
      }));
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(formatResponse('error', 'Registration failed'));
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(formatResponse('error', 'Email and password are required'));
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json(formatResponse('error', 'Invalid email or password'));
      }

      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json(formatResponse('error', 'Invalid email or password'));
      }

      const token = generateToken(user._id);

      res.json(formatResponse('success', 'Login successful', {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: user.fullName
        }
      }));
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(formatResponse('error', 'Login failed'));
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json(formatResponse('error', 'Email is required'));
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json(formatResponse('error', 'User not found'));
      }

      // TODO: Generate reset token and send email
      // const resetToken = crypto.randomBytes(32).toString('hex');
      // user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      // user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      // await user.save();

      res.json(formatResponse('success', 'Password reset link sent to your email'));
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json(formatResponse('error', 'Failed to process forgot password'));
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json(formatResponse('error', 'Token and password are required'));
      }

      // TODO: Verify token and reset password
      res.json(formatResponse('success', 'Password reset successful'));
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json(formatResponse('error', 'Failed to reset password'));
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.userId)
        .select('-password')
        .populate('selectedCourse')
        .populate('challenges')
        .populate('resume')
        .populate('earnedCertificates');

      if (!user) {
        return res.status(404).json(formatResponse('error', 'User not found'));
      }

      res.json(formatResponse('success', 'User retrieved successfully', { user }));
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve user'));
    }
  }
}

module.exports = new AuthController();
