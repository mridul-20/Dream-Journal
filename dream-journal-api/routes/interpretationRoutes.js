const express = require('express');
const {
  getRandomInterpretation,
  getInterpretations,
  createInterpretation
} = require('../controllers/interpretationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/random')
  .get(getRandomInterpretation);

router.route('/')
  .get(protect, authorize('admin'), getInterpretations)
  .post(protect, authorize('admin'), createInterpretation);

module.exports = router;