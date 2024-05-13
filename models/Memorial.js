const mongoose = require('mongoose');
const { Schema } = mongoose;
const shortid = require('shortid'); // Optional: use for generating unique slugs

// Define the BurialMemory schema
const burialMemorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxLength: 100 },
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    other_names: { type: String, maxLength: 100, default: null },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Others',
        maxLength: 100
    },
    slug: { type: String, unique: true },
    image: { type: String, default: null },
    date_of_birth: { type: Date, required: true },
    date_of_death: { type: Date, required: true },
    place_of_birth: { type: String, maxLength: 220, default: null },
    place_of_death: { type: String, maxLength: 220, default: null },
    cause_of_death: { type: String, maxLength: 200, default: null },
    brief_biography: { type: String, default: null },
    education: { type: String, default: null },
    work_life: { type: String, default: null },
    family_biography: { type: String, default: null },
    burial_ceremony_address: { type: String, maxLength: 220, default: null },
    accept_donations: { type: Boolean, default: false },
}, { timestamps: true });

// Helper functions similar to Django's property methods
burialMemorySchema.methods.getName = function() {
    return `${this.title}-${this.first_name} ${this.last_name}`;
};

burialMemorySchema.methods.name = function() {
    return `${this.title}-${this.first_name} ${this.last_name} ${this.other_names}`;
};

burialMemorySchema.methods.calculatedAge = function() {
    const birthDate = new Date(this.date_of_birth);
    const deathDate = new Date(this.date_of_death);
    let age = deathDate.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if birth date has not occurred yet this year
    const birthDayOfYear = (birthDate.getMonth() * 31) + birthDate.getDate();
    const deathDayOfYear = (deathDate.getMonth() * 31) + deathDate.getDate();
    
    if (deathDayOfYear < birthDayOfYear) {
        age -= 1;
    }
    
    return age;
};

burialMemorySchema.methods.imageUrl = function() {
    if (this.image) {
        return this.image;
    } else {
        // Return a default image URL
        return "https://res.cloudinary.com/geetechlab-com/image/upload/v1659898818/nwaben.com/daddy_heaven_3_m0xhos.jpg";
    }
};

// Middleware for pre-save event (e.g., generating a unique slug)
burialMemorySchema.pre('save', async function(next) {
    if (!this.slug) {
        // Use shortid or other library to generate unique slug
        this.slug = shortid.generate(); // You can replace this with your slug generator logic
    }
    next();
});

// Create and export the model
const BurialMemory = mongoose.model('BurialMemory', burialMemorySchema);

module.exports = BurialMemory;
