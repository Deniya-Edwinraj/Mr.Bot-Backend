import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute.js'; 
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'; 

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));


app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());

const mongoDBConnectionString = process.env.MONGO_URI;

mongoose.connect(mongoDBConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


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

// POST New message
app.post('/chat', async (req, res) => {
    try {
        const { role, text } = req.body;
        const message = new Message({ role, text });
        await message.save();
        console.log('Message object:', message);
        res.status(201).json({ success: true, message });
        
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ success: false, error: 'Failed to save message' });
    }
});

// GET All Messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json({ success: true, messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});