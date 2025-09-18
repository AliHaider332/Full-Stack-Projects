const express = require('express');
const { commentController } = require('../controller/posts');
const commentRouter = express.Router();
commentRouter.post('/add-comment', commentController);
module.exports = { commentRouter };
