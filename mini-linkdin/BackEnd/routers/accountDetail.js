const express = require('express');
const { accountDetailController } = require('../controller/account');
const accountDetailRouter = express.Router();

accountDetailRouter.post('/detail', accountDetailController);
module.exports = { accountDetailRouter };

