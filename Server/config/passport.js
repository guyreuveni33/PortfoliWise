const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use your API key from SendGrid

// Function to generate a secure random password
function generateRandomPassword(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

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
                    const randomPassword = generateRandomPassword(); // Generate a random password

                    // Save hashed password to the database
                    //const hashedPassword = await bcrypt.hash(randomPassword, 10);

                    user = new User({
                        email: profile.emails[0].value,
                        fullName: profile.displayName,
                        nickname: profile.name.givenName,
                        password: randomPassword,
                    });
                    await user.save();

                    // Send the plain password to the user's email
                    const msg = {
                        to: profile.emails[0].value, // User's email
                        from: 'guyreu40@gmail.com', // Verified sender address
                        subject: 'Your Account Password',
                        text: `Hello ${profile.name.givenName},\n\nYour account has been created successfully! Your password is: ${randomPassword}\n\nPlease keep it safe and secure.\n\nFor your security, please change your password after logging in.\n\nBest regards,\nYour Team`,
                    };

                    try {
                        await sgMail.send(msg);
                        console.log('Email sent successfully with the password:', randomPassword);
                    } catch (error) {
                        console.error('Error sending email:', error.response ? error.response.body : error.message);
                    }
                }

                done(null, user);
            } catch (error) {
                console.error('Error during Google authentication:', error);
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
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
