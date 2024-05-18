const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/isAuthenticated')
const User = require('../models/User'); // Import the User model
const Tribute = require('../models/Tribute');
const Gallery = require('../models/Gallery');
const formatDate = require('../utils/humanize');


// Function to render a view with the user's profile data
const renderPageWithUserProfile = async (req, res, viewName) => {
    try {
        const userId = req.user ? req.user._id : null;

        const user = await User.findById(userId).populate({
            path: 'profile',
            select: 'image',
        });

        const tributes = await Tribute.find()
            .populate({
                path: 'by',
                select: 'full_name is_admin profile',
                populate: {
                    path: 'profile',
                    select: 'image',
                },
            })
            .sort({ on: -1 });

        const galleries = await Gallery.find().populate({
            path: 'by',
            select: 'username full_name is_admin profile',
        }).sort({ createdAt: -1 });

        res.render(viewName, {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
            isAuthenticated: req.isAuthenticated(),
            user: user || null,
            tributes: tributes || [],
            galleries: galleries || [],
            formatDate
        });
    } catch (error) {
        console.error(`Error fetching user's profile for ${viewName} route:`, error);
        res.render(viewName, {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
            isAuthenticated: req.isAuthenticated(),
            user: null,
            tributes: [],
            galleries: [],
        });
    }
};

router.get("/", async (req, res) => {
    await renderPageWithUserProfile(req, res, 'home');
});


router.get("/dashboard", isAuthenticated, async (req, res) => {
    await renderPageWithUserProfile(req, res, 'dashboard');
});


module.exports = router