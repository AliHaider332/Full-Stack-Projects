const express = require('express');
const multer = require('multer');
const path = require('path'); // ✅ import path
const { profileUpdateController } = require('../controller/account');

const updateProfileRouter = express.Router();

// Multer instance
const uploadProfile = multer({ storage: multer.memoryStorage() });

// Route with multer middleware
updateProfileRouter.patch(
  '/update-profile',
  uploadProfile.single('pic'), // ✅ correct usage
  profileUpdateController
);

module.exports = { updateProfileRouter };
