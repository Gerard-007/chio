const User = require('../models/User');


async function findUserByEmail(email) {
    try {
        return await User.findOne({ email });
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = findUserByEmail;
