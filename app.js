const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");

const Accommodation = require("./models/accommodation");

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

app.get('/', (req, res) => {
  res.render('home');
})

// Display all accommodations
app.get('/accommodations', catchAsync(async (req, res) => {
  const accommodations = await Accommodation.find({});
  res.render('accommodations/index', { accommodations });
}))

// ********* BELOW 2 ROUTES WORK TOGETHER
// Form to create new accommodations
app.get('/accommodations/new', (req, res) => {
  res.render('accommodations/new');
})

// Creates new accommodations on server
app.post('/accommodations', catchAsync(async (req, res) => {
  const newAccommodation = new Accommodation(req.body.accommodation);
  await newAccommodation.save();
  res.redirect(`/accommodations/${newAccommodation._id}`);
}))
// ********* ABOVE 2 ROUTES WORK TOGETHER

// Details for one specific accommodation
app.get('/accommodations/:id', catchAsync(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);
  res.render('accommodations/show', { accommodation });
}))

// ********* BELOW 2 ROUTES WORK TOGETHER
// Form to edit specific accommodation
app.get('/accommodations/:id/edit', catchAsync(async (req, res) => {
  const foundAccommodation = await Accommodation.findById(req.params.id);
  res.render('accommodations/edit', { foundAccommodation });
}))

// Updates specific accommodation on server
app.put('/accommodations/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, { ...req.body.foundAccommodation });
  res.redirect(`/accommodations/${updatedAccommodation._id}`)
}))
// ********* ABOVE 2 ROUTES WORK TOGETHER

// Deletes specific accommodation on server
app.delete('/accommodations/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Accommodation.findByIdAndDelete(id);
  res.redirect('/accommodations');
}))

app.use((err, req, res, next) => {
  res.send("SOMETHING WENT WRONG :( ");
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})