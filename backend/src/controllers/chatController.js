const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getMessages };
