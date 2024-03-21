require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const cookieParser = require("cookie-parser");

// const userController = require('./controller/user');
const galleryController = require('./controller/galleryController');
const usergalleryController = require('./controller/usergalleryController');
const requireAuth = require('./middleware/requireAuth');
const authController = require('./controller/authController');
const app = express();



// Error handling middleware
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve uploaded images from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//check on seclected port if the backend runs sucessfully
app.get("/", (req, res) => {
  res.send("ako to");
}); 

//auth
app.post('/api/register', authController.register);
app.post('/api/login' , authController.login);
app.get('/api/check-verification/:id', authController.checkVerification);
app.post('/api/forgotpassword', authController.forgotPassword);
app.post('/api/newpassword', authController.newPassword);
//auth parin admin get, edit, delete user
app.get('/api/getallusers', authController.getAllUsers);
app.patch('/api/edit/user/:id', authController.editUser);
app.delete('/api/delete/user/:id', authController.deleteUser)
app.put('/api/toggle-verification/:id', authController.toggleUserVerification);


//admin upload image crud
app.post('/api/upload',requireAuth , galleryController.upload.single('image'), galleryController.handleUpload);
app.get('/api/gallery', galleryController.getGallery);
app.put('/api/gallery/:id',requireAuth, galleryController.editImage);
// app.delete('/api/gallery/:id',requireAuth, galleryController.deleteImage);


//admin image approval to user's upload 
app.get('/api/pending-images', usergalleryController.getPendingImages);
app.put('/api/approve-image/:id', usergalleryController.approveImage);
app.delete('/api/decline-image/:id', usergalleryController.declineImage);

app.get('/api/user/gallery/adopt', usergalleryController.usergetGalleryAdopt);


//user upload image
app.post('/api/user/upload',requireAuth, usergalleryController.upload.array('images', 4), usergalleryController.userHandleupload);
app.get('/api/user/gallery', usergalleryController.usergetGallery);
app.delete('/api/user/gallery/:id',requireAuth, usergalleryController.userdeleteImage);
//adoption request (admin side)
app.put('/api/adoption/request/approve/:id', usergalleryController.approveRequest);
app.put('/api/adoption/request/decline/:id', usergalleryController.declineRequest);
app.get('/api/get/adoption/request', usergalleryController.getadoptRequest)
//adoption request (user side)
app.post('/api/adoption/request',requireAuth ,usergalleryController.adoptRequest)
app.get('/api/get/adoption/request/:id',requireAuth , usergalleryController.getAdoptionRequestById)



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
