import express from 'express';
import postController from '../controllers/PostController';
const router = express.Router();

router.get('/:userId', postController.getPostsByUserId.bind(postController));

export { router };
