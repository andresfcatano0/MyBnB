const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { accommodationSchema } = require("../joiSchemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Accommodation = require("../models/accommodation");

const validateAccommodation = (req, res, next) => {
  const { error } = accommodationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400 )
  } else {
    next();
  }
}

// Display all accommodations
router.get('/', catchAsync(async (req, res) => {
  const accommodations = await Accommodation.find({});
  res.render('accommodations/index', { accommodations });
}))

// ********* BELOW 2 ROUTES WORK TOGETHER
// Form to create new accommodations
router.get('/new', isLoggedIn, (req, res) => {
  res.render('accommodations/new');
})

// Creates new accommodations on server
router.post('/', isLoggedIn, validateAccommodation, catchAsync(async (req, res) => {
  // if (!req.body.accommodation) throw new ExpressError('Invalid Accommodation Data', 400);   
  const newAccommodation = new Accommodation(req.body.accommodation);
  // Associate currently logged in user with accommodation being created
  newAccommodation.author = req.user._id;
  await newAccommodation.save();
  req.flash('success', 'Successfully created an accommodation!');
  res.redirect(`/accommodations/${newAccommodation._id}`);
}))
// ********* ABOVE 2 ROUTES WORK TOGETHER

// Details for one specific accommodation
router.get('/:id', catchAsync(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id).populate('reviews').populate('author');
  // console.log(accommodation);
  if (!accommodation) {
    req.flash('error', 'Cannot find that accommodation!');
    return res.redirect('/accommodations');
  }
  res.render('accommodations/show', { accommodation });
}))

// ********* BELOW 2 ROUTES WORK TOGETHER
// Form to edit specific accommodation
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);
  if (!accommodation) {
    req.flash('error', 'Cannot find that accommodation!');
    return res.redirect('/accommodations');
  }
  res.render('accommodations/edit', { accommodation });
}))

// Updates specific accommodation on server
router.put('/:id', isLoggedIn, validateAccommodation, catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, { ...req.body.accommodation });
  req.flash('success', 'Successfully updated accommodation!');
  res.redirect(`/accommodations/${updatedAccommodation._id}`)
}))
// ********* ABOVE 2 ROUTES WORK TOGETHER

// Deletes specific accommodation on server
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Accommodation.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted accommodation!');
  res.redirect('/accommodations');
}))

module.exports = router;