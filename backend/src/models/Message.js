import { Schema, model } from 'mongoose';

/**
 * Represents a message in the chat system.
 *
 * @typedef {Object} Message
 * @property {Schema.Types.ObjectId} author - The ID of the user who sent the message.
 * @property {string} text - The content of the message.
 * @property {Date} timestamp - The timestamp when the message was sent.
 * @property {Schema.Types.ObjectId} room - The ID of the room where the message was sent.
 */
const messageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
});

export default model('Message', messageSchema);
