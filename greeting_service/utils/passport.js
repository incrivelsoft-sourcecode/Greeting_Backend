import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../model/User.js';
import Analytics from "../model/AnalyticsModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://greeting-microservice.onrender.com/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ $or: [{googleId: profile.id}, {email: profile.emails[0].value}] });
        if (!user) {
          user = new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
          const analytics = new Analytics({
            user: user._id,
          });
      
          await analytics.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
