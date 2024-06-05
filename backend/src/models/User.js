import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'guest'], default: 'user' },
  expirationDate: { type: Date, default: null }
});

userSchema.statics.findByToken = async function(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return this.findById(decoded.id);
  } catch (err) {
    return null;
  }
};

const User = mongoose.model('User', userSchema);
export default User;
