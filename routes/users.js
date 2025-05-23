const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); 
const User = require("../models/user"); 
const passport = require("passport");

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    // Login right after registering
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to MyBnB!');
      res.redirect('/accommodations');
    });
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }  
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/accommodations');
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/accommodations');
  });
}); 

module.exports = router;