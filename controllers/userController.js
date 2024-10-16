import asyncHandler from 'express-async-handler';
import generateToken from '../jwtToken.js';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';


// @desc     Auth user/set token
// route    POST /api/users/auth
// @access Public 

const authUser =asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
    
        res.json(`Login Sucessfully`);
        // console.log(token);
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
});

// @desc    register a user
// route    POST /api/users
// @access Public 
const registerUser = asyncHandler (async (req, res) =>{
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
      res.status(400);
      throw new Error('User already exists');
  }
  const user = await User.create({
      name,
      email,
      password
  });
  if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        success:true,
        message :"Welcome to MASK"    });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASS
        }
      });
      var mailOptions = {
        from : 'deniyaedwinraj@gmail.com',
        to : user.email ,
        subject : 'Welcome to Mr.Bot: Your Registration is Successful!',
        html : `
        <h3>You have successfully registered with Mr.Bot! Thank you for joining our growing community. As a valued member, you’ll now have access to personalized AI interactions, where you can ask questions, get real-time answers, and explore a variety of helpful tools. Whether you need assistance with tasks, research, or simply want to engage in a fun conversation, Mr.Bot is here to assist. We’re constantly improving and adding new features to enhance your experience. If you need any help, feel free to reach out to our support team. We’re excited to have you on board and hope you enjoy your time with Mr.Bot!<h3/>
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('id sent: ' + info.response);
        }
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

// @desc    get user profile
// route    GET/api/users/profile
// @access Private
const getUserProfile =asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }

    res.status(200).json(user);
});


// @desc    Update user profile
// route    PUT /api/users/profile
// @access Private 
const updateUserProfile =asyncHandler(async (req, res) => {
    // res.status(200).json({message: 'Update user profile'});
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json(`Update sucessfully`);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
});

// @desc    get all users
// route    GET /api/users/all-users
// @access  Public
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc    get a single user
// route    GET/api/users/
// @access Public


const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});


// @desc    delete a single user
// route    Delete/api/users/
// @access Public
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// block the user
const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userToBlock = await User.findById(userId);

  if (!userToBlock) {
    return res.status(404).json({ message: 'User not found' });
  }

  userToBlock.status = 'blocked';
  await userToBlock.save();

  res.status(200).json({ message: 'User blocked successfully' });
});

export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getallUser,
    getaUser,
    deleteaUser,
    blockUser
};