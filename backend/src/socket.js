import { Server } from 'socket.io';
import Message from './models/Message.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

const rateLimit = {};

const RATE_LIMIT_MAX = 5; // Maximum number of messages
const RATE_LIMIT_WINDOW = 10000; // Time window in milliseconds (10 seconds)

function isRateLimited(socket) {
  const now = Date.now();
  const userLimit = rateLimit[socket.user._id] || { count: 0, lastMessage: now };

  if (userLimit.lastMessage + RATE_LIMIT_WINDOW < now) {
    // Reset the rate limit window
    userLimit.count = 0;
    userLimit.lastMessage = now;
  }

  userLimit.count += 1;

  rateLimit[socket.user._id] = userLimit;

  return userLimit.count > RATE_LIMIT_MAX;
}

/**
 * Sets up the socket server and handles socket events.
 * @param {Object} server - The server object.
 */
export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  /**
   * Middleware function to handle socket authentication.
   * @param {Object} socket - The socket object.
   * @param {Function} next - The next function to call.
   */
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.info('No token provided');
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      const user = await User.findById(decoded._id);
      if (!user) {
        console.info('User not found for token:', token);
        return next(new Error('Authentication error: User not found'));
      }
      socket.user = user;
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      next(new Error('Authentication error: Token verification failed'));
    }
  });

  /**
   * Event handler for socket connection.
   * @param {Object} socket - The socket object.
   */
  io.on('connection', (socket) => {
    console.log('a user connected');

    /**
     * Event handler for joining a room.
     * @param {Object} data - The data object containing the room information.
     */
    socket.on('joinRoom', ({ room }) => {
      if (!socket.user) {
        socket.emit('authError', { message: 'Authentication required' });
        return;
      }

      socket.join(room);
      socket.room = room;
      console.log(`${socket.user.username} joined room: ${room}`);
    });

    /**
     * Event handler for sending a message.
     * @param {Object} data - The data object containing the message information.
     */
    socket.on('sendMessage', async ({ text, room, recipient }) => {
      if (!socket.user) {
        socket.emit('authError', { message: 'Authentication required' });
        return;
      }

      if (isRateLimited(socket)) {
        console.log('Rate limit exceeded by user:', socket.user.username);
        socket.emit('rateLimitExceeded', { message: 'You are sending messages too fast. Please slow down.' });
        return;
      }

      const newMessage = new Message({
        author: socket.user._id,
        text,
        room: room || socket.room,
        recipient: recipient || null,
        timestamp: new Date()
      });
      await newMessage.save();

      await newMessage.populate('author', 'username');

      if (room) {
        io.to(room).emit('receiveMessage', newMessage);
      } else if (recipient) {
        const recipientUser = await User.findById(recipient);
        if (recipientUser && recipientUser.socketId) {
          io.to(recipientUser.socketId).emit('receiveMessage', newMessage);
        }
      }
    });

    /**
     * Event handler for socket disconnection.
     */
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
