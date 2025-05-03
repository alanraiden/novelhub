const express = require('express');
const novelRouter = express.Router();
const novelController = require('../controllers/novelController');
const isLoggedIn = require('../authentication/authentication');
const upload = require('../middlewares/cloudinaryStore');

// Public routes
novelRouter.get('/', novelController.getAllNovels);
novelRouter.get('/search', novelController.searchNovels);
novelRouter.get('/:id', novelController.getNovelById);

// Protected routes (require authentication)
novelRouter.post('/', isLoggedIn, upload.fields([
    { name: 'coverPhoto', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 }
]), novelController.createNovel);

novelRouter.post('/:novelId/toggle-like', isLoggedIn, novelController.toggleNovelLike);

module.exports = novelRouter;
