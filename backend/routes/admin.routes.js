const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Course = require('../models/Course');
const User = require('../models/User');
const { formatResponse } = require('../utils/helpers');

const router = express.Router();

// Admin middleware
router.use(auth, admin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments({ isActive: true });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json(formatResponse('success', 'Stats retrieved', {
      totalUsers,
      totalCourses,
      activeUsers
    }));
  } catch (error) {
    res.status(500).json(formatResponse('error', 'Failed to retrieve stats'));
  }
});

// Create course
router.post('/courses/create', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(formatResponse('success', 'Course created', { course }));
  } catch (error) {
    res.status(500).json(formatResponse('error', 'Failed to create course'));
  }
});

// Update course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(formatResponse('success', 'Course updated', { course }));
  } catch (error) {
    res.status(500).json(formatResponse('error', 'Failed to update course'));
  }
});

module.exports = router;
