const express = require('express');
const auth = require('../middleware/auth');
const challengeController = require('../controllers/challengeController');

const router = express.Router();

router.post('/start', auth, challengeController.startChallenge);
router.get('/my-challenges', auth, challengeController.getUserChallenges);
router.get('/:id', auth, challengeController.getChallengeById);
router.post('/complete-day', auth, challengeController.completeDay);

module.exports = router;
