const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                const existingUser = await User.findOne({ googleId: profile.id });
                
                if (existingUser) {
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                    return done(null, existingUser);
                }

                // Create new user
                const newUser = await new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    lastLogin: new Date()
                }).save();

                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);