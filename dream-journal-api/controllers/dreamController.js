const mongoose = require('mongoose');
const Dream = require('../models/Dream');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all dreams for a user
// @route   GET /api/dreams
// @access  Private
exports.getDreams = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Dream.find(JSON.parse(queryStr)).where({ user: req.user.id });

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-date');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Dream.countDocuments(JSON.parse(queryStr)).where({ user: req.user.id });

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const dreams = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: dreams.length,
    pagination,
    data: dreams
  });
});

// @desc    Get single dream
// @route   GET /api/dreams/:id
// @access  Private
exports.getDream = asyncHandler(async (req, res, next) => {
  const dream = await Dream.findById(req.params.id).where({ user: req.user.id });

  if (!dream) {
    return next(
      new ErrorResponse(`Dream not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: dream
  });
});

// @desc    Create new dream
// @route   POST /api/dreams
// @access  Private
exports.createDream = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const dream = await Dream.create(req.body);

  res.status(201).json({
    success: true,
    data: dream
  });
});

// @desc    Update dream
// @route   PUT /api/dreams/:id
// @access  Private
exports.updateDream = asyncHandler(async (req, res, next) => {
  let dream = await Dream.findById(req.params.id);

  if (!dream) {
    return next(new ErrorResponse(`Dream not found with id ${req.params.id}`, 404));
  }

  // Verify dream belongs to user
  if (dream.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this dream`, 401));
  }

  // Update only allowed fields
  const { title, description, emotions, tags, type, lucid, rating } = req.body;
  
  dream = await Dream.findByIdAndUpdate(
    req.params.id,
    { 
      title, 
      description, 
      emotions, 
      tags, 
      type, 
      lucid, 
      rating,
      updatedAt: Date.now()
    },
    { 
      new: true,
      runValidators: true 
    }
  );

  res.status(200).json({
    success: true,
    data: dream
  });
});

// @desc    Delete dream
// @route   DELETE /api/dreams/:id
// @access  Private
exports.deleteDream = asyncHandler(async (req, res, next) => {
  const dream = await Dream.findById(req.params.id);

  if (!dream) {
    return next(new ErrorResponse(`Dream not found with id ${req.params.id}`, 404));
  }

  // Verify dream belongs to user
  if (dream.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this dream`, 401));
  }

  await dream.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get dream statistics
// @route   GET /api/dreams/stats
// @access  Private
exports.getDreamStats = asyncHandler(async (req, res, next) => {
  const stats = await Dream.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(String(req.user.id)) }
    },
    {
      $group: {
        _id: null,
        totalDreams: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        lucidPercentage: {
          $avg: {
            $cond: [{ $eq: ['$lucid', true] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalDreams: 1,
        avgRating: { $round: ['$avgRating', 2] },
        lucidPercentage: { $multiply: [{ $round: ['$lucidPercentage', 2] }, 100] }
      }
    }
  ]);

  const emotionStats = await Dream.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(String(req.user.id)) }
    },
    {
      $unwind: '$emotions'
    },
    {
      $group: {
        _id: '$emotions',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ]);

  const mostCommonEmotion = emotionStats.length > 0 ? emotionStats[0]._id : null;

  const result = {
    ...(stats.length > 0 ? stats[0] : { totalDreams: 0, avgRating: 0, lucidPercentage: 0 }),
    mostCommonEmotion
  };

  res.status(200).json({
    success: true,
    data: result
  });
});