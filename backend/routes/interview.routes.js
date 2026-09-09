const express = require('express');
const auth = require('../middleware/auth');
const interviewController = require('../controllers/interviewController');

const router = express.Router();

router.post('/start', auth, interviewController.startInterview);
router.post('/submit-answer', auth, interviewController.submitAnswer);
router.post('/:interviewId/complete', auth, interviewController.completeInterview);
router.get('/:interviewId/report', auth, interviewController.getInterviewReport);
router.get('/history', auth, interviewController.getInterviewHistory);

module.exports = router;
