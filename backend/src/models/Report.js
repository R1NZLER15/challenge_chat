import { Schema, model } from 'mongoose';

/**
 * Represents the schema for a report in the application.
 *
 * @typedef {Object} ReportSchema
 * @property {Schema.Types.ObjectId} message - The ID of the message being reported.
 * @property {String} originalMessage - The original content of the reported message.
 * @property {Schema.Types.ObjectId} reportedBy - The ID of the user who reported the message.
 * @property {Date} timestamp - The timestamp when the report was created (default: current date).
 * @property {String} status - The status of the report (default: 'pending').
 * @property {Schema.Types.ObjectId} resolvedBy - The ID of the user who resolved the report (default: null).
 */
const reportSchema = new Schema({
  message: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  originalMessage: { type: String, required: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

export default model('Report', reportSchema);
