const { accommodationSchema, reviewSchema } = require("./joiSchemas.js");
const ExpressError = require("./utils/ExpressError");
const Accommodation = require("./models/accommodation");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // isAuthenticated() method comes from passport
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateAccommodation = (req, res, next) => {
  const { error } = accommodationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400 )
  } else {
    next();
  }
}

module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  // If currently loggedin user doesn't own accommodation, user can't edit
  const accommodation = await Accommodation.findById(id);
  if (!accommodation.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/accommodations/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  // If currently loggedin user doesn't own review, user can't edit
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/accommodations/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400 )
  } else {
    next();
  }
}