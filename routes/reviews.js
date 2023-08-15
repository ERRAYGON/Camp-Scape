const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams is used because, :id is defined in app.js and to use it we need to set it to true here 

const catchAsync = require("../utils/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;