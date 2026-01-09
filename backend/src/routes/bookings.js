const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// TODO: Implement booking routes
router.get('/', (req, res) => {
  res.json({ message: 'Bookings routes - to be implemented' });
});

module.exports = router;

