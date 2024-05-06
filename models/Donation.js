// Define the Donation schema
const donationSchema = new Schema({
    burial_memory: {
        type: Schema.Types.ObjectId,
        ref: 'BurialMemory',
        required: true,
    },
    donor_fullname: {
        type: String,
        maxLength: 200,
        required: false,
        null: true,
    },
    donor_email: {
        type: String,
        maxLength: 200,
        required: false,
        null: true,
    },
    currency: {
        type: String,
        default: 'NGN',
        required: false,
        null: true,
    },
    status: {
        type: String,
        maxLength: 100,
        required: false,
        null: true,
    },
    trans_ref: {
        type: String,
        maxLength: 200,
        required: false,
        null: true,
    },
    amount: {
        type: mongoose.Decimal128,
        default: 0.00,
        required: false,
        null: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Method to return a readable representation of the document (similar to Django's `__str__`)
donationSchema.methods.toString = function() {
    return `${this.burial_memory_id} -> ${this.donor_fullname} ${this.amount}`;
};

// Create and export the model
const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;