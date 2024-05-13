const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the MemoryTribute schema
const memoryTributeSchema = new Schema({
    // burial_memory: { type: Schema.Types.ObjectId, ref: 'BurialMemory', required: true },
    tribute_text: { type: String, required: true },
    category: { type: String, enum: ['candle', 'flower', 'note'], default: 'candle' },
    by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    on: { type: Date, default: Date.now },
}, { timestamps: true });

// Method to return a readable representation of the document (similar to Django's `__str__`)
// memoryTributeSchema.methods.toString = function() {
//     return `${this.burial_memory.user.username} ${this.tribute_text.slice(0, 10)}`;
// };

// Create and export the model
const MemoryTribute = mongoose.model('MemoryTribute', memoryTributeSchema);

module.exports = MemoryTribute;