import Room from '../models/Room.js';
import Message from '../models/Message.js';

/**
 * Retrieves all rooms from the database and sends them as a JSON response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('createdBy', 'username');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Retrieves messages from a room.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the messages are retrieved.
 */
export const getMessages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const messages = await Message.find({ room: room._id }).populate('author', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * Create a new room.
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user making the request.
 * @param {string} req.user.role - The role of the user making the request.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the room.
 * @param {string} req.user.id - The ID of the user creating the room.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the room is created.
 */
export const createRoom = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role === 'guest') {
      return res.status(403).json({ message: 'Guests cannot create rooms.' });
    }
    const room = new Room({
      name: req.body.name,
      createdBy: req.user.id
    });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Deletes a room and all its associated messages.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success or error message.
 */
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    //Remove all messages in the room
    await Message.deleteMany({ room: room._id });
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};