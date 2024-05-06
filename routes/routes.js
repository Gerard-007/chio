const express = require('express');
const router = express.Router();
// const formatDate = require('../utils/humanize');
const {isAuthenticated} = require('../middleware/isAuthenticated')
const Profile = require('../models/Profile'); // Import the Profile model
const User = require('../models/User'); // Import the User model


// Function to render a view with the user's profile data
const renderPageWithUserProfile = async (req, res, viewName) => {
    try {
        // Retrieve the logged-in user's ID
        const userId = req.user._id;
        // console.log(`User ${userId}`)

        // Fetch the user's profile from the database and populate the user reference
        const profile = await Profile.findOne({ user: userId }).populate('user');
        // console.log(`Profile ${profile}`)

        // Render the view and pass the user object
        res.render(viewName, {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1), // Capitalize the first letter of the view name for the title
            isAuthenticated: req.isAuthenticated(),
            user: profile || null, // Pass the populated user object
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