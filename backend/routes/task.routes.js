const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Placeholder for daily task routes
router.get('/:challengeId/tasks', auth, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Daily tasks retrieved',
    data: []
  });
});

module.exports = router;
