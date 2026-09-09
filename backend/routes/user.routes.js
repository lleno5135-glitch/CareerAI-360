const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/preferences', auth, userController.updatePreferences);
router.post('/profile-picture', auth, upload.single('profileImage'), userController.uploadProfilePicture);

module.exports = router;
