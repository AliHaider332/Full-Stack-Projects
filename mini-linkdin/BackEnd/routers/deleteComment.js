const express = require('express');
const { deleteComment } = require('../controller/posts');
const deleteCommentRouter = express.Router();
deleteCommentRouter.post('/delete-comment', deleteComment);
module.exports = { deleteCommentRouter };
