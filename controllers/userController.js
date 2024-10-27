import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register
export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  console.log('Request body:', req.body); // Log incoming request body
  console.log('Role being saved:', role); // Log the role to ensure it's being passed

  try {
    const user = await User.create({ username, email, password, role });
    console.log('User created:', user); // Log the created user
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'User registration failed', message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully' });
};

// Update User
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  console.log('Updating user with ID:', userId, 'Updates:', updates);

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
      
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found after update attempt' });
      }

      console.log('Updated user:', updatedUser);
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'User update failed', error: error.message });
  }
};


