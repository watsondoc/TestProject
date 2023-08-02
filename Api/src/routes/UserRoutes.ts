import express from 'express';
import userController from '../controllers/userController';
const router = express.Router();

// Get all users
router.get('/', userController.getRemoteUsers.bind(userController));

export { router };
