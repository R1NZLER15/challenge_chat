import cron from 'node-cron';
import User from './models/User.js';
import Message from './models/Message.js';

cron.schedule('0 0 * * *', async () => {
  // Run daily at midnight

  // Delete expired guest users
  const expiredUsers = await User.find({ role: 'guest', expirationDate: { $lt: new Date() } });
  const expiredUserIds = expiredUsers.map(user => user._id);

  // Delete expired users
  await User.deleteMany({ _id: { $in: expiredUserIds } });

  // Set text to "Deleted content" for messages from deleted users
  await Message.updateMany({ author: { $in: expiredUserIds } }, { text: 'Deleted content' });

  // Delete messages older than 5 days
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 5);
  await Message.deleteMany({ timestamp: { $lt: expirationDate } });
});
