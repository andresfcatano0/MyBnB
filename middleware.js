module.exports.isLoggedIn = (req, res, next) => {
  // isAuthenticated() method comes from passport
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
}