const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  slug: { type: String, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  bio: { type: String, default: 'Say something about yourself' },
  image: { type: String, default: 'https://res.cloudinary.com/geetechlab-com/image/upload/v1583147406/nwaben.com/user_azjdde_sd2oje.jpg'}, // Assuming you save the image URL
  phone_number: { type: String, maxlength: 14 },
  birth_day: { type: Date },
  country: { type: String, default: 'Nigeria' },
  state: { type: String },
  city: { type: String },
  local_area: { type: String },
  address: { type: String }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
