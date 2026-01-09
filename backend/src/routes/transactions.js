const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// TODO: Implement transaction routes
router.get('/', (req, res) => {
  res.json({ message: 'Transactions routes - to be implemented' });
});

module.exports = router;

