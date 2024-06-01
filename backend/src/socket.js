const socketIO = require('socket.io');
const Message = require('./models/Message');

const setupSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('joinRoom', (username) => {
            socket.username = username;
        });

        socket.on('sendMessage', async (message) => {
            const newMessage = new Message({ author: socket.username, text: message, timestamp: new Date() });
            await newMessage.save();
            io.emit('receiveMessage', newMessage);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

module.exports = { setupSocket };
