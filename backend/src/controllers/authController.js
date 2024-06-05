import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role || 'user'
    });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const guestLogin = async (req, res) => {
  let timestamp = new Date().getTime();
  let guestUsername = `Guest${timestamp}`;
  let hashedPassword = await bcrypt.hash(guestUsername, 10);
  // The expiration date is 5 days from now
  let expirationDate = new Date(timestamp + 5 * 24 * 60 * 60 * 1000);
  const newGuest = new User({
    username: guestUsername,
    password: hashedPassword,
    role: 'guest',
    expirationDate: expirationDate
  });
  newGuest.save();
  const token = generateToken(newGuest);
  res.json({ user: newGuest, token });
};


export const checkAuth = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.json(req.user);
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
