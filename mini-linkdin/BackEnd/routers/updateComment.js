const express = require('express');
const { updateComment } = require('../controller/posts');
const updateCommentRouter = express.Router();
updateCommentRouter.post('/update-comment', updateComment);
module.exports = { updateCommentRouter };
