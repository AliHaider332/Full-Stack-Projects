const express = require('express');
const multer = require('multer');

const { userSignInController } = require('../controller/auth');
const userSignInRouter = express.Router();

// Use memory storage instead of disk storage
const uploadProfile = multer({ storage: multer.memoryStorage() });

userSignInRouter.post(
  '/user-sign-in',
  uploadProfile.single('pic'),
  userSignInController
);

module.exports = { userSignInRouter };
