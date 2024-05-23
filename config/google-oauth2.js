const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User'); // Import User model
const Profile = require('../models/Profile'); // Import Profile model
require('dotenv').config();

module.exports = function(passport) {
    // Use the Google strategy in the provided passport instance
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true,
    },
    async function(request, accessToken, refreshToken, googleProfile, done) {
        try {
            // Use the provided Google ID or generate a random one if not present
            const googleId = googleProfile.id || uuidv4();
    
            // Find the user by their Google ID
            let user = await User.findOne({ googleId });
    
            // If the user is found
            if (user) {
                // If the user has an associated profile
                if (user.profile) {
                    let userProfile = await Profile.findById(user.profile);
    
                    // Update the existing profile with new data
                    userProfile.image = googleProfile.photos && googleProfile.photos[0] ? googleProfile.photos[0].value : userProfile.image;
                    userProfile.gender = googleProfile.gender || userProfile.gender;
                    userProfile.full_name = googleProfile.displayName || userProfile.full_name;
    
                    // Save the updated profile
                    await userProfile.save();
                }
    
                // Return the user to be logged in
                return done(null, user);
            } else {
                // If user is not found, create a new user
                user = new User({
                    full_name: googleProfile.displayName,
                    email: googleProfile.emails && googleProfile.emails[0] ? googleProfile.emails[0].value : null,
                    googleId: googleId,
                    username: googleProfile.displayName.replace(/\s+/g, '').toLowerCase() || googleId, // Generate a username if needed
                    date_joined: Date.now(),
                });
    
                // Save the new user
                await user.save();
    
                // Create a new profile for the user
                const userProfile = new Profile({
                    slug: user.username,
                    image: googleProfile.photos && googleProfile.photos[0] ? googleProfile.photos[0].value : null,
                    gender: googleProfile.gender || 'Other',
                    bio: 'Say something about yourself',
                    user: user._id, // Link the profile to the user
                });
    
                // Save the profile
                await userProfile.save();
    
                // Update the user's profile reference
                user.profile = userProfile._id;
                await user.save();
    
                // Return the new user
                return done(null, user);
            }
        } catch (err) {
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
            // Find the user by their ID and populate the profile reference
            const user = await User.findById(id).populate('profile');
            done(null, user);
        } catch (err) {
            console.error('Error during deserialization:', err);
            done(err);
        }
    });
};
