// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { initializePassport } from './passport-config.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import socket setup function
import { setupSocket } from './socket.js';

// Import cleanup script
import './cleanup.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use cors middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Use express built-in middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
initializePassport();

// Use express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
   }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  }
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.log(err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reports', reportRoutes);

// Use error handler middleware
app.use(errorHandler);

// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// Setup socket
setupSocket(server);