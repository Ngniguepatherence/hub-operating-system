const express = require('express');
const {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
  uploadMiddleware
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDocuments);

router.route('/upload')
  .post(uploadMiddleware, uploadDocument);

router.route('/:id')
  .get(getDocument)
  .delete(deleteDocument);

module.exports = router;

