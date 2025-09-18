const express = require('express');
const { myPosts } = require('../controller/posts');
const myPostRouter = express.Router();
myPostRouter.post('/my-post', myPosts);
module.exports={myPostRouter}
