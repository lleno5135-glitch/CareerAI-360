const express = require('express');
const auth = require('../middleware/auth');
const certificateController = require('../controllers/certificateController');

const router = express.Router();

router.post('/:challengeId/generate', auth, certificateController.generateCertificate);
router.get('/verify/:certificateNumber', certificateController.verifyCertificate);
router.get('/my-certificates', auth, certificateController.getUserCertificates);
router.get('/:certificateId/download', auth, certificateController.downloadCertificate);

module.exports = router;
