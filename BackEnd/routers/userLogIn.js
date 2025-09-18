const express = require('express');
const { userLogInController } = require('../controller/auth');
const userLogInRouter = express.Router();
userLogInRouter.post('/user-login', userLogInController);

module.exports = { userLogInRouter };
