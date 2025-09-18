const express = require('express');
const { deleteAccountController } = require('../controller/account');
const accountDeleteRouter = express.Router();
accountDeleteRouter.delete('/account-delete', deleteAccountController);
module.exports = { accountDeleteRouter };
