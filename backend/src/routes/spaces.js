const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// TODO: Implement space routes
router.get('/', (req, res) => {
  res.json({ message: 'Spaces routes - to be implemented' });
});

module.exports = router;

