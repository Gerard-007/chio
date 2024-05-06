const User = require('../models/User'); // Import your User model


async function generateUsername(email) {
    // Extract the base username from the email (the part before the @ symbol)
    const usernameBase = email.split('@')[0];
    let username = usernameBase;
    let counter = 1;

    // Check if the username already exists in the database
    let existingUser = await User.findOne({ username });

    // If the username already exists, append an incrementing number to find a unique username
    while (existingUser) {
        username = `${usernameBase}${counter}`;
        existingUser = await User.findOne({ username });
        counter++;
    }

    // Return the unique username found
    return username;
}

module.exports = generateUsername;
