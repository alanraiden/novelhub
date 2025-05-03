const express = require('express');
const { googleAuthController } = require('../oauth/googleAuth');
const googleAuthRouter = express.Router();

googleAuthRouter.post('/google-login', googleAuthController);

module.exports = googleAuthRouter;
