const express = require('express');
const auth = require('../middleware/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/search', courseController.searchCourses);
router.get('/categories', courseController.getCategories);
router.get('/:id', courseController.getCourseById);

module.exports = router;
