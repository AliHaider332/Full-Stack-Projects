const express = require('express');
const {
  loginStatusController,
  logOutController,
} = require('../controller/auth');
const loginStatusRouter = express.Router();
loginStatusRouter.get('/login-status', loginStatusController);
loginStatusRouter.delete('/logout', logOutController);
module.exports = loginStatusRouter;
