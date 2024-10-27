import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', logoutUser);

// Update route
router.put('/update/:userId', updateUser);

export default router;

