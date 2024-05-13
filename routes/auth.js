const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const Profile = require('../models/Profile');
const generateUsername = require('../utils/generateUsername');
const {isNotAuthenticated} = require('../middleware/isAuthenticated')


// Create passport local strategy
passport.use(User.createStrategy())

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        // Use await to perform the asynchronous findById operation
        const user = await User.findById(id);
        // If the operation succeeds, pass the user to the done callback
        done(null, user);
    } catch (err) {
        // If there is an error, pass the error to the done callback
        done(err);
    }
});


// Display Authentication page.
router.get("/register", isNotAuthenticated, async (req, res) => {
    return res.render("register", {
        title: "Authentication",
        isAuthenticated: req.isAuthenticated(),
        user: null
    });
})


// Display Authentication page.
router.get("/login", isNotAuthenticated, async (req, res) => {
    return res.render("login", {
        title: "login",
        isAuthenticated: req.isAuthenticated(),
        user: null
    });
})


router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        // Use the generateUsername function to get a unique username
        const username = await generateUsername(req.body.email);

        console.log(`
            email: ${req.body.email}
            full_name: ${req.body.full_name}
            username: ${username}
        `);

        // Create a new user instance
        const newUser = new User({
            email: req.body.email,
            full_name: req.body.full_name,
            username: username
        });

        // Register the user using the passport-local-mongoose plugin
        User.register(newUser, req.body.password, async (err, user) => {
            if (err) {
                console.log('Error registering user:', err);

                // Check for specific errors
                if (err.name === 'UserExistsError') {
                    // Handle duplicate email error
                    req.flash('error', 'This email is already in use.');
                } else if (err.errors && err.errors.full_name && err.errors.full_name.kind === 'required') {
                    // Handle missing full_name error
                    req.flash('error', 'Full name is required.');
                } else {
                    // Handle other types of errors
                    req.flash('error', 'Error registering user: ' + err.message);
                }

                // Redirect back to the registration page with the flash message
                return res.redirect('/auth/register');
            }

            // Create a new profile instance for the registered user
            const newProfile = new Profile({
                user: user._id,
                slug: user.username,
                gender: 'Other',
                bio: 'Say something about yourself',
                // Add any other profile fields here
            });

            // Save the profile instance
            const userProfile = await newProfile.save();

            // Assign the profile ID to the user's profile field
            user.profile = userProfile._id;
            await user.save();

            // If registration is successful, redirect to the login page
            res.redirect('/auth/login');
        });
    } catch (error) {
        console.log('Unexpected error:', error);
        req.flash('error', 'Unexpected error occurred during registration');
        res.redirect('/auth/register');
    }
});





// Login User
router.post('/login', isNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        // Check for Mongoose timeouts
        if (err && err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
            // Flash a custom error message
            req.flash('error', 'Connection is slow, please try again later.');
            // Redirect to the login page
            return res.redirect('/auth/login');
        }

        // If authentication is successful, log in the user
        if (user) {
            req.logIn(user, (err) => {
                if (err) {
                    // If there was an error logging in the user, call the next error handler
                    return next(err);
                }
                // Redirect to the home page if login is successful
                return res.redirect('/');
            });
        } else {
            // If authentication failed, flash a custom error message
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/auth/login');
        }
    })(req, res, next);
});



// Logout user
router.get('/logout', (req, res) => {
    // Log out the user by destroying the session
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
        // Redirect to the home page or login page after logging out
        res.redirect('/auth/login');
    });
});



// =============== Google Auth =============
// Import the Google strategy

router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth/register'
    })
);


module.exports = router;