const express = require('express');
const {
  getDreams,
  getDream,
  createDream,
  updateDream,
  deleteDream,
  getDreamStats
} = require('../controllers/dreamController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getDreams)
  .post(protect, createDream);

router.route('/stats')
  .get(protect, getDreamStats);

router.route('/:id')
  .get(protect, getDream)
  .put(protect, updateDream)
  .delete(protect, deleteDream);

module.exports = router;