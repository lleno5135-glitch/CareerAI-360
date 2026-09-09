const Course = require('../models/Course');
const { formatResponse } = require('../utils/helpers');

class CourseController {
  // Get all courses
  async getAllCourses(req, res) {
    try {
      const { category, difficulty, search, page = 1, limit = 10 } = req.query;

      const filter = { isActive: true };
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const courses = await Course.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ popularity: -1 });

      const total = await Course.countDocuments(filter);

      res.json(formatResponse('success', 'Courses retrieved successfully', {
        courses,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page
        }
      }));
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve courses'));
    }
  }

  // Get single course
  async getCourseById(req, res) {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json(formatResponse('error', 'Course not found'));
      }

      res.json(formatResponse('success', 'Course retrieved successfully', { course }));
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve course'));
    }
  }

  // Search courses
  async searchCourses(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json(formatResponse('error', 'Search query is required'));
      }

      const courses = await Course.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ],
        isActive: true
      });

      res.json(formatResponse('success', 'Search completed', { courses }));
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json(formatResponse('error', 'Failed to search courses'));
    }
  }

  // Get course categories
  async getCategories(req, res) {
    try {
      const categories = await Course.distinct('category');
      res.json(formatResponse('success', 'Categories retrieved', { categories }));
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve categories'));
    }
  }
}

module.exports = new CourseController();
