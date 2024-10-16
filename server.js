// import path from 'path';
// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cookieParser from 'cookie-parser';
// import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
// import nodemailer from 'nodemailer';
// import cors from 'cors';
// import morgan from 'morgan';
// import userRoutes from './routes/userRoute.js';

// dotenv.config();

// const port = process.env.PORT || 8000;
// const mongoString = process.env.MONGO_URI;
// const app = express();

// // Connect to MongoDB
// mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
// const database = mongoose.connection;

// database.on('error', (error) => {
//     console.log(error);
// });
// database.once('connected', () => {
//     console.log('Database Connected...');
// });

// // CORS Configuration
// const corsInstance = cors({ origin: ['http://localhost:3000'], credentials: true });
// app.use(corsInstance);

// // Express Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Fixed typo: extended should be spelled correctly
// app.use(morgan('dev'));
// app.use(cookieParser());

// // Routes
// app.use('/users', userRoutes);

// // Message Schema
// const messageSchema = new mongoose.Schema({
//     role: { type: String, required: true },
//     text: { type: String, required: true },
//     timestamp: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Message = mongoose.model('Message', messageSchema);

// // POST Route to Store a New Message
// app.post('/chat', async (req, res) => {
//     try {
//         const { role, text } = req.body;
//         const message = new Message({ role, text });
//         await message.save();

//         console.log('Message stored in MongoDB');
//         res.status(201).json({ success: true, message });
//     } catch (err) {
//         console.error('Error saving message:', err);
//         res.status(500).json({ success: false, error: 'Failed to save message' });
//     }
// });

// // GET Route to Retrieve All Messages
// app.get('/messages', async (req, res) => {
//     try {
//         const messages = await Message.find().sort({ timestamp: 1 });
//         res.status(200).json({ success: true, messages });
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ success: false, error: 'Failed to fetch messages' });
//     }
// });

// // Error Handlers
// app.use(notFound);
// app.use(errorHandler);

// // Start the Server
// app.listen(port, () => console.log(`Server started on port ${port}`));

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'deniyaedwinraj@gmail.com',
//         pass: 'xwqn hecr khsw goxg'
//     }
// });


import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import nodemailer from 'nodemailer';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/userRoute.js';
import axios from 'axios'; // Added axios to make API calls

dotenv.config();

const port = process.env.PORT || 8000;
const mongoString = process.env.MONGO_URI;
const app = express();

// Connect to MongoDB
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected...');
});

// CORS Configuration
const corsInstance = cors({ origin: ['http://localhost:3000'], credentials: true });
app.use(corsInstance);

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);

// Message Schema
const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

// POST Route to Store a New Message and Get Gemini API Response
app.post('/chat', async (req, res) => {
    try {
        const { role, text } = req.body;

        // Store the message in MongoDB
        const message = new Message({ role, text });
        await message.save();

        // Make a request to Gemini API using axios
        const geminiApiUrl = 'https://api.gemini.com/v1beta/cachedContents'; // Replace with the correct Gemini API endpoint
        const geminiApiKey = process.env.GEMINI_API_KEY; // Store your API key in environment variables

        // Example: Send text to the API and get the response
        const response = await axios.post(geminiApiUrl, {
            input: text,  // Send the input text to the API
        }, {
            headers: {
                'Authorization': `Bearer ${geminiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle the response from Gemini API
        const geminiResponse = response.data; // Assuming the API returns a `data` field

        console.log('Message stored in MongoDB and Gemini API responded');
        res.status(201).json({ success: true, message, geminiResponse }); // Send the response back to the client
    } catch (err) {
        console.error('Error saving message or fetching Gemini API response:', err);
        res.status(500).json({ success: false, error: 'Failed to save message or fetch Gemini response' });
    }
});

// GET Route to Retrieve All Messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start the Server
app.listen(port, () => console.log(`Server started on port ${port}`));

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deniyaedwinraj@gmail.com',
        pass: 'xwqn hecr khsw goxg'
    }
});
