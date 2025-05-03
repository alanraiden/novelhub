const express = require('express');
const chapterRouter = express.Router();
const chapterController = require('../controllers/chapterController');
const isLoggedIn = require('../authentication/authentication');

chapterRouter.get('/:novelId/chapters', isLoggedIn, chapterController.getChaptersByNovelId);
chapterRouter.get('/:novelId/chapters/:chapterId', chapterController.getChapterById);

chapterRouter.post('/:novelId/new-chapter', isLoggedIn, chapterController.uploadChapter);

module.exports = chapterRouter;
