const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// TODO: Implement document routes with file upload
router.get('/', (req, res) => {
  res.json({ message: 'Documents routes - to be implemented' });
});

module.exports = router;

