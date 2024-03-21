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


  const userHandleupload = async (req, res) => {
    try {
      const user_id = req.user._id
      const user_email = req.user.email;
      const { caption, breed, gender, age, medhistory, others, species } = req.body;
      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ success: false, message: 'No files uploaded' });
      }
    
      const newItemPromises = req.files.map(file => {
          const newItem = new UserGallery({ 
              caption, 
              imageUrl: file.filename, 
              breed, 
              gender, 
              age, 
              medhistory,
              user_id, 
              user_email,
              others,
              species,
          });
          return newItem.save();
      });
      
      await Promise.all(newItemPromises);
      
      res.json({ success: true, message: 'Upload successful' });
    } catch (error) {
      console.error('Error handling upload:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
  

  
  const usergetGallery = async (req, res) => {
    try {
      const usergalleryItems = await UserGallery.aggregate([
        {
          $match: { approved: true },
          $match: { approved: false } 
        },
        {
          $sort: { createdAt: 1 } 
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              hour: { $hour: '$createdAt' },
              minute: { $minute: '$createdAt' }, 
              second: { $second: '$createdAt' } 
            },
            user_email: { $first: '$user.email' }, 
            images: { $push: '$$ROOT' } 
          }
        }
      ]);
  
      res.json(usergalleryItems);
    } catch (error) {
      console.error('Error getting gallery:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  




  //admin get the image
  const getPendingImages = async (req, res) => {
    try {
      const usergalleryItems = await UserGallery.aggregate([
        {
          $match: { approved: false }
        },
        {
          $sort: { createdAt: 1 } 
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              hour: { $hour: '$createdAt' },
              minute: { $minute: '$createdAt' }, 
              second: { $second: '$createdAt' } 
            },
            user_email: { $first: '$user.email' }, 
            images: { $push: '$$ROOT' } 
          }
        }
      ]); 
      res.json(usergalleryItems);
    } catch (error) {
      console.error('Error fetching pending images:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  //admin approve image
  const approveImage = async (req, res) => {
    const { id } = req.params;
  
    try {
      const image = await UserGallery.findByIdAndUpdate(id, { approved: true }, { new: true });
      if (!image) {
        return res.status(404).json({ success: false, message: 'Image not found' });
      }
      res.json({ success: true, message: 'Image approved successfully', image });
    } catch (error) {
      console.error('Error approving image:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

  //admin decline
  const declineImage = async (req, res) => {
    const { id } = req.params;
  
    try {
      const image = await UserGallery.findByIdAndUpdate(id, { approved: true}, { new: false });
      if (!image) {
        return res.status(404).json({ success: false, message: 'Image not found' });
      }
      res.json({ success: true, message: 'Image declined successfully', image });
    } catch (error) {
      console.error('Error declining image:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


  const usergetGalleryAdopt = async (req, res) => {
    try {
      const usergalleryItems = await UserGallery.aggregate([
        {
          $match: { status: false },
        },
        {
          $sort: { createdAt: 1 } 
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              hour: { $hour: '$createdAt' },
              minute: { $minute: '$createdAt' }, 
              second: { $second: '$createdAt' } 
            },
            user_email: { $first: '$user.email' }, 
            images: { $push: '$$ROOT' } 
          }
        }
      ]);
  
      res.json(usergalleryItems);
    } catch (error) {
      console.error('Error getting gallery:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  //request for adoption
  const adoptRequest = async (req, res) => {
    try {
      const { name, address, contactinfo, message, imageUrl } = req.body;
      const user_id = req.user._id
      const user_email = req.user.email;

      const newRequest = new UserGallery({ name, address, contactinfo, message, user_id, user_email, imageUrl });
      await newRequest.save();
      res.status(201).json({ message: 'Adoption request submitted successfully' });
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // API endpoint to get all adoption requests (for admin)
  const getadoptRequest = async (req, res) => {
    try {
      const requests = await UserGallery.find();
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
// get adoption request by id (user)
const getAdoptionRequestById = async (req, res) => {
  try {
      const id = req.params.id; 
      const request = await UserGallery.find({ user_id: id }); 
    
      if (!request) {
          return res.status(404).json({ error: 'Adoption request not found' });
      }
    
      res.status(200).json(request);
  } catch (error) {
      console.error('Error fetching adoption request by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
// aprove adoption request
const approveRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { message } = req.body;
    const updatedRequest = await UserGallery.findByIdAndUpdate(requestId, { status: 'approved', message });
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }
    res.status(200).json({ message: 'Adoption request approved successfully' });
  } catch (error) {
    console.error('Error approving adoption request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Decline adoption request
const declineRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { message } = req.body;
    const updatedRequest = await UserGallery.findByIdAndUpdate(requestId, { status: 'declined', message });
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }
    res.status(200).json({ message: 'Adoption request declined successfully' });
  } catch (error) {
    console.error('Error declining adoption request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  

module.exports = { upload, 
  userHandleupload, 
  usergetGallery, 
  userdeleteImage, 
  approveImage, 
  declineImage, 
  getPendingImages, 
  usergetGalleryAdopt,  
  adoptRequest, 
  getadoptRequest, 
  getAdoptionRequestById, 
  declineRequest,
  approveRequest };