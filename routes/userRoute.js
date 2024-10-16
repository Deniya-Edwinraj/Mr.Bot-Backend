import express from 'express';

const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getallUser,
    getaUser,
    deleteaUser,
    blockUser
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
.route('/profile')
.get( protect,getUserProfile)
.put( protect,updateUserProfile);
router.get('/all-users', getallUser);
router.get('/:id', getaUser);

export default router;