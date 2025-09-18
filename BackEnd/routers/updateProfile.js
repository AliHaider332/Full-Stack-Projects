const express = require('express');
const multer = require('multer');
const path = require('path'); // ✅ import path
const { profileUpdateController } = require('../controller/account');

const updateProfileRouter = express.Router();


const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer instance
const uploadProfile = multer({ storage: profileStorage });

// Route with multer middleware
updateProfileRouter.patch(
  '/update-profile',
  uploadProfile.single('pic'), // ✅ correct usage
  profileUpdateController
);

module.exports = { updateProfileRouter };
