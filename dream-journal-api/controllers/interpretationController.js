const Interpretation = require('../models/Interpretation');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get random interpretation
// @route   GET /api/interpretations/random
// @access  Public
exports.getRandomInterpretation = asyncHandler(async (req, res, next) => {
  const { keyword } = req.query;

  let interpretation;
  if (keyword) {
    // Try to find an exact match first
    interpretation = await Interpretation.findOne({ 
      keyword: { $regex: new RegExp(`^${keyword}$`, 'i') } 
    });

    // If no exact match, find similar keywords
    if (!interpretation) {
      interpretation = await Interpretation.aggregate([
        {
          $match: {
            keyword: { $regex: keyword, $options: 'i' }
          }
        },
        { $sample: { size: 1 } }
      ]);
      interpretation = interpretation.length > 0 ? interpretation[0] : null;
    }
  } else {
    // Get completely random interpretation
    const count = await Interpretation.countDocuments();
    const random = Math.floor(Math.random() * count);
    interpretation = await Interpretation.findOne().skip(random);
  }

  if (!interpretation) {
    return next(
      new ErrorResponse('No interpretation found', 404)
    );
  }

  res.status(200).json({
    success: true,
    data: interpretation
  });
});

// @desc    Get all interpretations (admin only)
// @route   GET /api/interpretations
// @access  Private/Admin
exports.getInterpretations = asyncHandler(async (req, res, next) => {
  const interpretations = await Interpretation.find();
  res.status(200).json({
    success: true,
    count: interpretations.length,
    data: interpretations
  });
});

// @desc    Create interpretation (admin only)
// @route   POST /api/interpretations
// @access  Private/Admin
exports.createInterpretation = asyncHandler(async (req, res, next) => {
  const interpretation = await Interpretation.create(req.body);

  res.status(201).json({
    success: true,
    data: interpretation
  });
});