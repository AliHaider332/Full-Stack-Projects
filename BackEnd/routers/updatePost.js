const express = require('express');
const multer = require('multer');
const path = require('path');
const { updatePost } = require('../controller/posts');

const updatePostRoute = express.Router();

// Storage config for multer
const postPicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const uploadPostPic = multer({ storage: postPicStorage });


updatePostRoute.put(
  '/update-post',
  uploadPostPic.fields([{ name: 'postPic' }, { name: 'video' }]),
  updatePost
);

module.exports = { updatePostRoute };
