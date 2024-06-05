import Report from '../models/Report.js';
import Message from '../models/Message.js';

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

export const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    report.status = req.body.status;
    if (req.body.status === 'approved') {
      report.resolvedBy = req.user.id;
      const message = await Message.findById(report.message);
      message.text = '[REDACTED]';
      await message.save();
    } else if (req.body.status === 'rejected') {
      report.resolvedBy = req.user.id;
    }
    await report.save();
    res.json(report);
  } catch (err) {
    next(err);
  }
};

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

