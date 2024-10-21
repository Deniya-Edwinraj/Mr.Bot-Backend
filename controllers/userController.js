import asyncHandler from 'express-async-handler';
import generateToken from '../jwtToken.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// @desc     Auth user/set token
// route    POST /api/users/auth
// @access Public 
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with:', { email, password }); // Check incoming values

  const user = await User.findOne({ email });

  if (!user) {
    console.log('User not found');
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  console.log('User found:', user);

  const isPasswordCorrect = await user.matchPassword(password);
  if (isPasswordCorrect) {
    console.log('Password correct');
    generateToken(res, user._id);
    res.json({ message: 'Login Successfully' });
  } else {
    console.log('Password incorrect');
    res.status(401).json({ message: 'Invalid email or password' });
  }
});



// @desc    register a user
// route    POST /api/users
// @access Public 
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id); 
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      success: true,
      message: 'Registration successful!',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// @desc     logout user
// route    POST /api/users/logout
// @access Public 
const logoutUser =asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });
    res.status(200).json(`User logged out`);
});

export{
    authUser,
    registerUser,
    logoutUser,
};