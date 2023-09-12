const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const multer = require('../middleware/multer');
const { body } = require('express-validator');

// Passport
const passport = require('passport');
const jwtStrategy = require('../strategies/jwt');
passport.use(jwtStrategy);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    res.json({ message: 'Welcome to the Linkle API' });
  }
);

router.get(
  '/user/me',
  body('body')
    .trim()
    .notEmpty()
    .withMessage('The field is empty. Please, fill the text area.'),
  passport.authenticate('jwt', { session: false }),
  apiController.getCurrentUser
);

router.patch(
  '/user/me/patch',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required.'),
    body('lastName').trim().notEmpty().withMessage('Last name is required.'),
    body('bio'),
    body('currentCity'),
    body('homeTown'),
  ],
  passport.authenticate('jwt', { session: false }),
  apiController.patchCurrentUser
);

router.patch(
  '/user/me/online',
  passport.authenticate('jwt', { session: false }),
  apiController.patchUserOnline
);

router.patch(
  '/user/me/remove-friend',
  passport.authenticate('jwt', { session: false }),
  apiController.patchRemoveFriend
);

router.get(
  '/user/search',
  passport.authenticate('jwt', { session: false }),
  apiController.getSearchResults
);

router.patch(
  '/user/me/offline',
  passport.authenticate('jwt', { session: false }),
  apiController.patchUserOffline
);

router.patch(
  '/user/me/friend-request/:id/confirm',
  passport.authenticate('jwt', { session: false }),
  apiController.patchConfirmFriendRequest
);

router.patch(
  '/user/me/friend-request/:id/remove',
  passport.authenticate('jwt', { session: false }),
  apiController.patchRemoveFriendRequest
);

router.get(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  apiController.getUser
);

router.patch(
  '/user/:id/friend-request/send',
  passport.authenticate('jwt', { session: false }),
  apiController.patchSendFriendRequest
);

router.patch(
  '/user/:id/friend-request/cancel',
  passport.authenticate('jwt', { session: false }),
  apiController.patchCancelFriendRequest
);

router.post(
  '/post/upload',
  multer.uploadPostImage.single('picture'),
  body('body')
    .trim()
    .notEmpty()
    .withMessage('The field is empty. Please, fill the text area.'),
  passport.authenticate('jwt', { session: false }),
  apiController.postUploadPost
);

router.post(
  '/post/share',
  body('body').optional(),
  passport.authenticate('jwt', { session: false }),
  apiController.postSharePost
);

router.post(
  '/comment/upload',
  body('body')
    .trim()
    .notEmpty()
    .withMessage('The field is empty. Please, fill the text area.'),
  passport.authenticate('jwt', { session: false }),
  apiController.postUploadComment
);

router.get(
  '/feed-posts',
  passport.authenticate('jwt', { session: false }),
  apiController.getFeedPosts
);

router.get(
  '/post/:id',
  passport.authenticate('jwt', { session: false }),
  apiController.getPost
);

router.patch(
  '/post/:id/like',
  passport.authenticate('jwt', { session: false }),
  apiController.patchLikePost
);

router.patch(
  '/post/:id/unlike',
  passport.authenticate('jwt', { session: false }),
  apiController.patchUnlikePost
);

module.exports = router;
