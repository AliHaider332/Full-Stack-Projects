const express = require('express');
const { getCommentById } = require('../controller/posts');
const getCommentRouter = express.Router();
getCommentRouter.post('/get-comment', getCommentById);
module.exports = { getCommentRouter };
