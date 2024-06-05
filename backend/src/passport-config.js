// Import necessary modules
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

/**
 * Initializes passport with a local strategy.
 * The strategy requires a `verify` function which receives the credentials
 * (`username` and `password`) submitted by the user. The function must verify
 * that the username and password are both correct and then invoke `done` with a
 * user object, which will be set at `req.user` in route handlers after
 * authentication.
 */
const initializePassport = () => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Try to find the user with the provided username
      const user = await User.findOne({ username });
      if (!user) {
        // If the user is not found, return a message indicating an incorrect username
        return done(null, false, { message: 'Incorrect username.' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // If the passwords do not match, return a message indicating an incorrect password
        return done(null, false, { message: 'Incorrect password.' });
      }

      // If the username and password are both correct, return the user object
      return done(null, user);
    } catch (err) {
      // If there is an error, return the error
      return done(err);
    }
  }));

  /**
   * In order to support login sessions, Passport will serialize and deserialize
   * user instances to and from the session.
   */
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Find the user with the provided ID
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      // If there is an error, return the error
      done(err);
    }
  });
};

export { initializePassport };
