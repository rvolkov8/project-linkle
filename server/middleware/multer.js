const multer = require('multer');
const path = require('path');
const multerGoogleStorage = require('multer-google-storage');

const uploadPostImage = multer({
  storage: multerGoogleStorage.storageEngine({
    autoRetry: true,
    bucket: 'linkle-images',
    projectId: 'linkle-398815',
    keyFilename: path.join(__dirname, '../linkle-398815-311fa9e8aea6.json'),
    // keyFilename: '/etc/secrets/linkle-398815-311fa9e8aea6.json',
    filename: (req, file, cb) => {
      cb(null, `posts/${Date.now()}`);
    },
  }),
});

const uploadAvatar = multer({
  storage: multerGoogleStorage.storageEngine({
    autoRetry: true,
    bucket: 'linkle-images',
    projectId: 'linkle-398815',
    keyFilename: path.join(__dirname, '../linkle-398815-311fa9e8aea6.json'),
    // keyFilename: '/etc/secrets/linkle-398815-311fa9e8aea6.json',
    filename: (req, file, cb) => {
      cb(null, `avatars/${Date.now()}`);
    },
  }),
});

module.exports = {
  uploadPostImage: uploadPostImage,
  uploadAvatar: uploadAvatar,
};
