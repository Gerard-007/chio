const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Notification schema
const notificationSchema = new Schema({
    notification_type: {
        type: Number,
        enum: [1, 2, 3, 4], // Corresponding to the choices in Django
        required: true,
    },
    to_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        null: true,
    },
    from_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        null: true,
    },
    from_admin: {
        type: String,
        default: "System Notification",
        required: false,
        null: true,
    },
    memorial_tribute: {
        type: Schema.Types.ObjectId,
        ref: 'MemoryTribute',
        required: false,
        null: true,
    },
    memorial_gallery: {
        type: Schema.Types.ObjectId,
        ref: 'MemoryGallery',
        required: false,
        null: true,
    },
    memorial_donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: false,
        null: true,
    },
    donation_by: {
        type: String,
        maxLength: 50,
        required: false,
        null: true,
    },
    wallet_transaction: {
        type: Schema.Types.ObjectId,
        ref: 'WalletTransaction',
        required: false,
        null: true,
    },
    text_preview: {
        type: String,
        maxLength: 50,
        required: false,
        null: true,
    },
    message: {
        type: String,
        maxLength: 225,
        required: false,
        null: true,
    },
    is_seen: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Method to return a readable representation of the document (similar to Django's `__str__`)
notificationSchema.methods.toString = function() {
    return `Notification from ${this.notification_type} -> ${this.to_user.username}`;
};

// Create and export the model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
