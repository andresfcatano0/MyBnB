const express = require("express");
const router = express.Router({mergeParams: true});
const { validateReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const Accommodation = require("../models/accommodation");
const Review = require("../models/review");

// Creates new review on server
router.post('/', validateReview, catchAsync(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);
  const review = new Review(req.body.review);
    // Associate currently logged in user with review being created
    review.author = req.user._id;
  // Push onto accommodation model reviews 
  accommodation.reviews.push(review);
  await review.save();
  await accommodation.save();
  req.flash('success', 'Created new review!');
  res.redirect(`/accommodations/${accommodation._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  // $pull - mongo operator to remove reference to specific review from an accommodation
  await Accommodation.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Deleted review!');
  res.redirect(`/accommodations/${id}`);
}))

module.exports = router;


// USED FOR DEBUGGING:
// console.log("ACCOMMODATION:" + accommodation)
// console.log("REVIEW:" + review)
// console.log("REQ.PARAMS " + JSON.stringify(req.params, null, 2));
// console.log("REQ.BOODY " + JSON.stringify(req.body, null, 2));