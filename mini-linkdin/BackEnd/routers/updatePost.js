const express = require('express');
const multer = require('multer');
const path = require('path');
const { updatePost } = require('../controller/posts');

const updatePostRoute = express.Router();

const uploadPostPic = multer({ storage: multer.memoryStorage() });

updatePostRoute.put(
  '/update-post',
  uploadPostPic.fields([{ name: 'postPic' }, { name: 'video' }]),
  updatePost
);

module.exports = { updatePostRoute };
