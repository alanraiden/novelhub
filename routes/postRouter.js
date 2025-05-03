const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController');
const isLoggedIn = require('../authentication/authentication');
const upload = require('../middlewares/cloudinaryStore');

// GET routes
postRouter.get('/', postController.getAllPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.get('/user/user-posts', isLoggedIn, postController.getPostsByUserId);

// POST routes
postRouter.post('/', upload.single('image'), isLoggedIn, postController.addPosts);
postRouter.post('/:postId/comments', isLoggedIn, postController.addCommentToPost);
postRouter.post('/:postId/like', isLoggedIn, postController.togglePostLike);
postRouter.post('/:postId/comments/:commentId/like', isLoggedIn, postController.toggleCommentLike); 

module.exports = postRouter;