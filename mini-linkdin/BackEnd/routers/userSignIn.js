const express = require('express');
const path = require('path');
const multer = require('multer');

const { userSignInController } = require('../controller/auth');
const userSignInRouter = express.Router();

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadProfile = multer({ storage: profileStorage });

userSignInRouter.post(
  '/user-sign-in',
  uploadProfile.single('pic'),
  userSignInController
);
module.exports = { userSignInRouter };
