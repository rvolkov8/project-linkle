const express = require('express');
const router = express.Router();

// Passport
const passport = require('passport');
const jwtStrategy = require('../strategies/jwt');
passport.use(jwtStrategy);

/* GET home page. */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    res.json({ message: 'Welcome to the Linkle API' });
  }
);

module.exports = router;
