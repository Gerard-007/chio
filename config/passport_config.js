const localStrategy =  require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');


function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        try {
            // Fetch the user by email
            const user = await getUserByEmail(email);

            // Check if the user exists
            if (!user) {
                return done(null, false, { message: "Invalid email/password provided" });
            }

            // Check if password is a string
            if (!password || typeof password !== 'string') {
                return done(null, false, { message: "Invalid email/password provided" });
            }

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.hash);

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid email/password provided" });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));

    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initialize;
