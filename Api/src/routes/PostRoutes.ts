import express from 'express';
import postController from '../controllers/PostController';
const router = express.Router();

router.get('/:userId', postController.getPostsByUserId.bind(postController));
router.delete('/:userId/:postId', postController.removePost.bind(postController));

export { router };
