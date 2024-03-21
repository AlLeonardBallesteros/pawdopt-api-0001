const mongoose = require('mongoose');

const GalleryUserSchema = new mongoose.Schema({
  caption: String,
  imageUrl: String,
  breed: String,
  gender: String,
  age: Number,
  species: String,
  others: String,
  medhistory: [String],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approved: {
    type: Boolean,
    default: false 
  },
  name: String,
  address: String,
  contactinfo: String,
  message: String,
  status: { type: String, default: 'pending' },
  
}, { timestamps: true });

const UserGallery = mongoose.model('UserGallery', GalleryUserSchema);

module.exports = UserGallery;
