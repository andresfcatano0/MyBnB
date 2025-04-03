const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const accommodations = require("./routes/accommodations");
const reviews = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, 'public')));

// For express router
app.use('/accommodations', accommodations);
app.use('/accommodations/:id/reviews', reviews);

app.get('/', (req, res) => {
  res.render('home');
})

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