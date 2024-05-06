const passport = require('passport');

// Middleware function to check if a user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // If the user is authenticated, proceed to the next middleware/route handler
        return next();
    }
    // If the user is not authenticated, redirect to the login page
    res.redirect('/auth/login');
}


function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}


module.exports = {
    isAuthenticated,
    isNotAuthenticated,
};