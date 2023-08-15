const Campground = require('../models/campground');
const Review = require('../models/reviews');
const mongoose = require('mongoose');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const { body, rating } = req.body.review;

    const newReview = new Review({
        _id: new mongoose.Types.ObjectId(),
        body,
        rating,
    });
    newReview.author = req.user._id;

    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', "created new review!");

    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    // Save the updated campground with the review removed
    // await campground.save();     
    res.redirect(`/campgrounds/${id}`);

}