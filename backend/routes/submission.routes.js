const express = require('express');
const auth = require('../middleware/auth');
const submissionController = require('../controllers/submissionController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/submit', auth, upload.single('file'), submissionController.submitTask);
router.get('/my-submissions', auth, submissionController.getUserSubmissions);
router.get('/:id', auth, submissionController.getSubmissionById);
router.post('/:submissionId/evaluate', auth, submissionController.evaluateSubmission);

module.exports = router;
