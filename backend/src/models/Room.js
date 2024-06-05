import { Schema, model } from 'mongoose';

/**
 * Represents a room in the chat application.
 *
 * @typedef {Object} Room
 * @property {string} name - The name of the room.
 * @property {Schema.Types.ObjectId} createdBy - The ID of the user who created the room.
 * @property {Date} createdAt - The date and time when the room was created.
 */
const roomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Room', roomSchema);
