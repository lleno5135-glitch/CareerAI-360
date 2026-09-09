const User = require('../models/User');
const { formatResponse } = require('../utils/helpers');

class UserController {
  // Update profile
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone, education, yearsOfExperience, industry, careerGoal, skills } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          firstName,
          lastName,
          phone,
          education,
          yearsOfExperience,
          industry,
          careerGoal,
          skills
        },
        { new: true, runValidators: true }
      );

      res.json(formatResponse('success', 'Profile updated successfully', { user }));
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json(formatResponse('error', 'Failed to update profile'));
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId)
        .select('-password')
        .populate('selectedCourse')
        .populate('projects')
        .populate('resume')
        .populate('earnedCertificates');

      if (!user) {
        return res.status(404).json(formatResponse('error', 'User not found'));
      }

      res.json(formatResponse('success', 'Profile retrieved successfully', { user }));
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve profile'));
    }
  }

  // Update preferences
  async updatePreferences(req, res) {
    try {
      const { theme, emailNotifications, pushNotifications, language } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          'preferences.theme': theme,
          'preferences.emailNotifications': emailNotifications,
          'preferences.pushNotifications': pushNotifications,
          'preferences.language': language
        },
        { new: true }
      );

      res.json(formatResponse('success', 'Preferences updated successfully', { user }));
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json(formatResponse('error', 'Failed to update preferences'));
    }
  }

  // Upload profile picture
  async uploadProfilePicture(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json(formatResponse('error', 'No file uploaded'));
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { profileImage: req.file.path },
        { new: true }
      );

      res.json(formatResponse('success', 'Profile picture updated', { user }));
    } catch (error) {
      console.error('Upload profile picture error:', error);
      res.status(500).json(formatResponse('error', 'Failed to upload profile picture'));
    }
  }
}

module.exports = new UserController();
