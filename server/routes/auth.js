const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const multer = require('../middleware/multer');

router.post(
  '/signup',
  multer.uploadAvatar.single('avatarFile'),
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required.')
      .isLength({ min: 5, max: 20 })
      .withMessage('Username must be between 5 and 20 characters.')
      .escape(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .escape(),
    body('confirmPassword')
      .trim()
      .notEmpty()
      .withMessage('Confirm password is required.')
      .escape(),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required.')
      .escape(),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required.')
      .escape(),
    body('currentCity').optional().escape(),
    body('hometown').optional().escape(),
  ],
  authController.postSignUp
);

router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required.')
      .escape(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required.')
      .escape(),
  ],
  authController.postLogIn
);

module.exports = router;
