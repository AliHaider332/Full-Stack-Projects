const express = require('express');
const multer = require('multer');
const path = require('path');
const { addPostController } = require('../controller/posts');

const addPostRouter = express.Router();

// Multer storage for post pictures
const postPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/'); // ✅ all uploads go here first
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: postPicStorage,
});

// Route
addPostRouter.post(
  '/add-post',
  upload.fields([
    { name: 'postPic', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  addPostController
);

module.exports = { addPostRouter };
