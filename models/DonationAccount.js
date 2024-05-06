// Define the DonationAccount schema
const donationAccountSchema = new Schema({
    burial_memory: {
        type: Schema.Types.ObjectId,
        ref: 'BurialMemory',
        required: true,
    },
    account_name: {
        type: String,
        maxLength: 100,
        required: false,
        null: true,
    },
    bank_account_number: {
        type: String,
        maxLength: 11,
        required: false,
        null: true,
    },
    bank_code: {
        type: String,
        maxLength: 100,
        required: false,
        null: true,
    },
    bank_name: {
        type: String,
        maxLength: 100,
        required: false,
        null: true,
    },
    sub_account_id: {
        type: String,
        maxLength: 200,
        required: false,
        null: true,
    },
    split_type: {
        type: String,
        enum: ['percentage', 'flat'],
        required: false,
        null: true,
    },
    split_value: {
        type: Number,
        required: false,
        null: true,
    },
    balance: {
        type: mongoose.Decimal128,
        default: 0.00,
        required: true,
    },
});

// Method to return a readable representation of the document (similar to Django's `__str__`)
donationAccountSchema.methods.toString = function() {
    return `${this.burial_memory.get_name}-${this.id}-${this.balance}`;
};

// Create and export the model
const DonationAccount = mongoose.model('DonationAccount', donationAccountSchema);

module.exports = DonationAccount;