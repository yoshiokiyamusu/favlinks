const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn,isPerfilUser } = require('../lib/auth');
// SIGNUP
router.get('/signup', (req, res) => { //isNotLoggedIn
  res.render('auth/signup');
});

router.get('/signin', isNotLoggedIn,(req, res) => { //isPerfilUser
  res.render('auth/signin');
});
/*
router.get('/signup_prueba', (req, res) => {
  res.render('auth/sign_prueba');
});
*/
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.post('/signin', isNotLoggedIn,(req, res,next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});
/*
router.post('/signup_prueba', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));
*/

router.get('/profile',  isLoggedIn,(req, res) => { //isLoggedIn
  res.render('profile');
  //res.send('this is your profile');
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

module.exports = router;
