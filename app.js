require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
    credentials: true
}));
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/introduction-videos', express.static(path.join(__dirname, 'public', 'introduction-videos')));


// Connect to MongoDB
const connectDB = require('./middlewares/dbConnection');
connectDB();

const port = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const authorRouter = require('./routes/authorRouter');
const novelRouter = require('./routes/novelRouter');
const gAuthRouter = require('./routes/googleAuthRouter')
const chatBotRouter = require('./routes/chatBotRouter');
const chapterRouter = require('./routes/chapterRouter');
const novelReviewsRouter = require('./routes/novelReviewsRouter');

// API routes
app.use('/api/auth', authRouter);
app.use('/api/oauth', gAuthRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/authors', authorRouter);
app.use('/api/novels', novelRouter);
app.use('/api/chatbot', chatBotRouter);
app.use('/api/chapters', chapterRouter);
app.use('/api/novel-reviews', novelReviewsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});