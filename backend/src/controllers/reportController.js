import Report from '../models/Report.js';
import Message from '../models/Message.js';

/**
 * Retrieves all reports from the database and sends them as a JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the reports are sent as a JSON response.
 */
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find();
    // Populate the reportedBy field with the username
    await Report.populate(reports, { path: 'reportedBy', select: 'username' });
    // Populate the message field with the text
    await Report.populate(reports, { path: 'message', select: 'text' });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new report.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {Object} req.body.reportedBy - The user who reported the message.
 * @param {string} req.body.reportedBy._id - The ID of the user who reported the message.
 * @param {Object} req.body.message - The message object.
 * @param {string} req.body.message.text - The text of the message.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the report is created.
 */
export const createReport = async (req, res, next) => {
  try {
    const report = new Report({
      reportedBy: req.body.reportedBy._id,
      message: req.body.message,
      originalMessage: req.body.message.text
    });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a report.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the report is updated.
 */
export const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    report.status = req.body.status;
    if (req.body.status === 'approved') {
      report.resolvedBy = req.user._id;
      const message = await Message.findById(report.message);
      message.text = '[REDACTED]';
      await message.save();
    } else if (req.body.status === 'rejected') {
      report.resolvedBy = req.user._id;
    }
    await report.save();
    res.json(report);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a report by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the report is deleted.
 */
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  } catch (err) {
    next(err);
  }
};

