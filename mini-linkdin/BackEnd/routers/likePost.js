const express = require('express');
const { likeController } = require('../controller/posts');
const likePostRouter = express.Router();
likePostRouter.post('/like-post', likeController);
module.exports = { likePostRouter };
