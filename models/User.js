const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String},
    // password: {type: String, required: [true, 'Please provide password'], minlength: 6},
    date_joined: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    is_staff: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', unique: true }
}, { timestamps: true });

// Apply the passport-local-mongoose plugin to handle password hashing and other password-related operations
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;
