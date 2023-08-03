const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const { body } = require('express-validator');

router.post(
  '/signup',
  [
    body('username').trim().notEmpty().escape(),
    body('password').trim().notEmpty().escape(),
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
  ],
  authController.postSignUp
);

router.post(
  '/login',
  [
    body('username').trim().notEmpty().escape(),
    body('password').trim().notEmpty().escape(),
  ],
  authController.postLogIn
);

module.exports = router;
