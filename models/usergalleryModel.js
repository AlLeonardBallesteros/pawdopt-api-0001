const mongoose = require('mongoose');

const userGallerySchema = new mongoose.Schema({
  imageUrl: String,
  caption: String,
  breed: String,
  gender: String,
  age: String,
  medhistory: String,
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

const UserGallery = mongoose.model('UserGallery', userGallerySchema);

module.exports = UserGallery;
