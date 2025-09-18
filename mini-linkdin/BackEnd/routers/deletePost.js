const express = require('express');
const { deletePost } = require('../controller/posts');
const deletePostRouter = express.Router();
deletePostRouter.delete('/delete-post', deletePost);
module.exports = { deletePostRouter };
