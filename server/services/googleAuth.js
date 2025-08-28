const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/user");
const { setUser } = require("./auth");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
          return done(null, existingUser);
        }
        
        // Check if user exists with the same email
        existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          // Update the user with Google ID
          existingUser.googleId = profile.id;
          existingUser.authProvider = "google";
          await existingUser.save();
          return done(null, existingUser);
        }
        
        // Create new user
        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: "google",
        });
        
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
