const Gallery = require('../models/galleryModel');
const multer = require('multer');
const path = require('path');


// Set up Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const handleUpload = async (req, res) => {
  try {
    const user_id = req.user._id
    const { category, caption } = req.body;
    const imageUrl = req.file.filename;

    // Save the data to MongoDB
    const newItem = await Gallery({ category, caption, imageUrl, user_id });
    await newItem.save();

    res.json({ success: true, message: 'Upload successful' });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ success: false, message: 'Server error' }); 
  }
};

const getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    res.json(galleryItems);
  } catch (error) {
    console.error('Error getting gallery:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const editImage = async (req, res) => {
  const { id } = req.params;
  const { caption } = req.body;

  try {
    let updatedFields = { caption };

    if (req.file) {
      // If a new image is provided, update the imageUrl
      updatedFields.imageUrl = req.file.filename;
    }

    const updatedImage = await Gallery.findByIdAndUpdate(id, updatedFields, { new: true });
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error); 
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting image with ID:', id);

  try {
    await Gallery.findByIdAndDelete(id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




module.exports = { upload, handleUpload, getGallery, editImage, deleteImage };
