// routes/authorRoutes.js
const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/authorController');
const isLoggedIn = require('../authentication/authentication');

authorRouter.get('/', isLoggedIn, authorController.getAuthors);
authorRouter.get('/dashboard', isLoggedIn, authorController.getAuthorById);

authorRouter.get('/author-dashboard/', isLoggedIn, authorController.getAuthorByUserId);

authorRouter.post('/applyAuthorship', isLoggedIn, authorController.applyForAuthor);

module.exports = authorRouter;