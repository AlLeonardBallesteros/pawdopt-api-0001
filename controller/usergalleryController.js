const UserGallery = require('../models/usergalleryModel');
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


  const userHandleupload = async (req, res) => {
    try {
      const user_id = req.user._id
        const { caption, breed, gender, age, medhistory } = req.body;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        
        // Map through the array of files and save each one to MongoDB
        const newItemPromises = req.files.map(file => {
            const newItem = new UserGallery({ 
                caption, 
                imageUrl: file.filename, 
                breed, 
                gender, 
                age, 
                medhistory,
                user_id
            });
            return newItem.save();
        });
        
        // Wait for all items to be saved
        await Promise.all(newItemPromises);
        
        res.json({ success: true, message: 'Upload successful' });
    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

  

  const usergetGallery = async (req, res) => {
    try {
      const usergalleryItems = await UserGallery.find();
      res.json(usergalleryItems);
    } catch (error) {
      console.error('Error getting gallery:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  const userdeleteImage = async (req, res) => {
    const { id } = req.params;
    console.log('Deleting image with ID:', id);
  
    try {
      await UserGallery.findByIdAndDelete(id);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


module.exports = { upload, userHandleupload, usergetGallery, userdeleteImage };