const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isreviewAuthor} = require('../middleware');
const reviews = require('../controllers/review')




router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isreviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;