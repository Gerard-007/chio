const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define the MemoryGallery schema
const memoryGallerySchema = new Schema({
    by: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    burial_memory: { type: Schema.Types.ObjectId, ref: 'BurialMemory', required: true },
    description: { type: String, default: null },
    image: { type: String, default: null },
    video: { type: String, default: null }, // You can use a URLField (String) for video links
    audio: { type: String, default: null },
    created: { type: Date, default: Date.now }
});


// Helper methods
memoryGallerySchema.methods.imageUrl = function() {
    return this.image;
};


memoryGallerySchema.methods.audioUrl = function() {
    return this.audio;
};


// Create and export the model
const MemoryGallery = mongoose.model('MemoryGallery', memoryGallerySchema);

module.exports = MemoryGallery;
