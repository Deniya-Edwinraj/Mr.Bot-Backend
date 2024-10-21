import express from 'express';

const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

export default router;