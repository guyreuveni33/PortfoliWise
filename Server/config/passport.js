const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Import bcrypt

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3001/api/users/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    // Create a new user with a dummy password
                    const dummyPassword = 'google-oauth-dummy-password';
                    const hashedPassword = await bcrypt.hash(dummyPassword, 10);

                    user = new User({
                        email: profile.emails[0].value,
                        fullName: profile.displayName,
                        nickname: profile.name.givenName,
                        password: hashedPassword, // Use the hashed dummy password
                    });
                    await user.save();
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Use async/await instead of callback
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


module.exports = passport;
