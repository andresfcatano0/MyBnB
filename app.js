const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { accommodationSchema, reviewSchema } = require("./joiSchemas.js");

const accommodations = require("./routes/accommodations");

const Accommodation = require("./models/accommodation");
const Review = require("./models/review");

mongoose.connect("mongodb://127.0.0.1:27017/mybnb")
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
  })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400 )
  } else {
    next();
  }
}

app.use('/accommodations', accommodations);

app.get('/', (req, res) => {
  res.render('home');
})

// Creates new review on server
app.post('/accommodations/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);
  const review = new Review(req.body.review);
  // console.log("ACCOMMODATION:" + accommodation)
  // console.log("REVIEW:" + review)
  // console.log("REQ.PARAMS " + JSON.stringify(req.params, null, 2));
  // console.log("REQ.BOODY " + JSON.stringify(req.body, null, 2));
  // Push onto accommodation model reviews 
  accommodation.reviews.push(review);
  await review.save();
  await accommodation.save();
  res.redirect(`/accommodations/${accommodation._id}`);
}))

app.delete('/accommodations/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  // $pull - mongo operator to remove reference to specific review from an accommodation
  await Accommodation.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/accommodations/${id}`);
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if(!err.message) err.message = "SOMETHING WENT WRONG";
  res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})