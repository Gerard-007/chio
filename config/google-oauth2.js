const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User'); // Import User model
const Profile = require('../models/Profile'); // Import Profile model
require('dotenv').config();

// Export a function that takes a passport instance as an argument
module.exports = function(passport) {
    // Use the Google strategy in the provided passport instance
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true,
    },
    async function(request, accessToken, refreshToken, profile, done) {
        try {
            // Find the user by their Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // If user is found, update their profile data
                let userProfile = await Profile.findOne({ user: user._id });
                if (!userProfile) {
                    // If profile doesn't exist, create a new one
                    userProfile = new Profile({
                        user: user._id,
                        image: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                        gender: profile.gender,
                        full_name: profile.displayName,
                        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                        // Add other fields as needed
                    });
                } else {
                    // Update the existing profile with new data
                    userProfile.image = profile.photos && profile.photos[0] ? profile.photos[0].value : userProfile.image;
                    userProfile.gender = profile.gender || userProfile.gender;
                    userProfile.full_name = profile.displayName || userProfile.full_name;
                    userProfile.email = profile.emails && profile.emails[0] ? profile.emails[0].value : userProfile.email;
                    // Add other fields as needed
                }
                // Save the profile
                await userProfile.save();
                return done(null, user);
            } else {
                // If user is not found, create a new user
                user = new User({
                    full_name: profile.displayName,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                    googleId: profile.id,
                    username: profile.username || profile.id, // Generate a username if needed
                    date_joined: Date.now(),
                });

                // Save the new user to the database
                await user.save();

                // Create a new profile for the user
                const userProfile = new Profile({
                    user: user._id,
                    image: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    gender: profile.gender,
                    full_name: profile.displayName,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
                    // Add other fields as needed
                });
                await userProfile.save();

                // Call done with the new user
                return done(null, user);
            }
        } catch (err) {
            // Call done with an error if something goes wrong
            console.error('Error in Google OAuth callback:', err);
            return done(err, false);
        }
    }));

    // Serialize user by their ID
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user by their ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            console.error('Error during deserialization:', err);
            done(err);
        }
    });
};
