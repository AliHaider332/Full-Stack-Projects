const express = require('express');
const { findPostById } = require('../controller/posts');
const getForEditPostRouter = express.Router();
getForEditPostRouter.post('/get-edit-post', findPostById);
module.exports={getForEditPostRouter}
