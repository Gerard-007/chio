const express = require('express');
const router = express.Router();
// const formatDate = require('../utils/humanize');
const {isAuthenticated} = require('../middleware/isAuthenticated')
const Profile = require('../models/Profile'); // Import the Profile model
const User = require('../models/User'); // Import the User model
const Tribute = require('../models/Tribute');


// Function to render a view with the user's profile data
const renderPageWithUserProfile = async (req, res, viewName) => {
    try {
        // Retrieve the logged-in user's ID
        const userId = req.user ? req.user._id : null;

        // Fetch the user's profile from the database and populate the user reference
        const user = await User.findById(userId).populate({
            path: 'profile',
            select: 'image', // Fetches the 'image' field from the Profile schema
        });

        // Fetch tributes and populate the 'by' field (User reference) and the 'profile' of the 'by' user
        const tributes = await Tribute.find()
            .populate({
                path: 'by', // Populate the 'by' field (user reference)
                select: 'full_name profile', // Select specific fields from the User schema including the 'profile' reference
                populate: {
                    path: 'profile', // Populate the 'profile' field from the User
                    select: 'image', // Select the 'image' field from the Profile schema
                },
            })
            .sort({ on: -1 });

        console.log('Current user:', user);
        console.log('Populated tributes:', tributes);

        // Render the view and pass the user object
        res.render(viewName, {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
            isAuthenticated: req.isAuthenticated(),
            user: user || null, // Passes the populated user object
            tributes: tributes || [],
        });
    } catch (error) {
        console.error(`Error fetching user's profile for ${viewName} route:`, error);
        // Handle the error (e.g., show an error message or redirect the user)
        res.render(viewName, {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
            isAuthenticated: req.isAuthenticated(),
            user: null, // Fallback to no user object in case of an error
        });
    }
};

router.get("/", async (req, res) => {
    await renderPageWithUserProfile(req, res, 'home');
});


router.get("/tribute", isAuthenticated, async (req, res) => {
    await renderPageWithUserProfile(req, res, 'tribute');
});


module.exports = router