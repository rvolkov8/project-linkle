const multer = require('multer');
const path = require('path');

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/posts');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadPost = multer({ storage: postStorage });

module.exports = { uploadAvatar: uploadAvatar, uploadPost: uploadPost };
