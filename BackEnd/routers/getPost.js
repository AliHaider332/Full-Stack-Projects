const express = require('express');
const { getAllPostController } = require('../controller/posts');
const getPostRouter = express.Router();
getPostRouter.get('/get-post', getAllPostController);

module.exports = { getPostRouter };
