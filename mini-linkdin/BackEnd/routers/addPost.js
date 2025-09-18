const express = require('express');
const multer = require('multer');
const path = require('path');
const { addPostController } = require('../controller/posts');

const addPostRouter = express.Router();

// Multer storage for post pictures

const upload = multer({
  storage: multer.memoryStorage(),
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
