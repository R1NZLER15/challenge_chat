import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes the admin user in the application.
 * If an admin user already exists, it logs a message and returns.
 * Otherwise, it creates a new admin user with the provided environment variables.
 * @returns {Promise<void>} A promise that resolves when the admin user is created or an error occurs.
 */
const initAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create a new admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new User({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

export default initAdmin;
