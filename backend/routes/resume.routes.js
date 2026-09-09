const express = require('express');
const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

router.post('/create', auth, resumeController.createResume);
router.get('/my-resume', auth, resumeController.getUserResume);
router.post('/:resumeId/analyze', auth, resumeController.analyzeResume);
router.post('/:resumeId/:courseId/generate', auth, resumeController.generateOptimizedResume);
router.get('/:resumeId/export-pdf', auth, resumeController.exportResumePDF);

module.exports = router;
