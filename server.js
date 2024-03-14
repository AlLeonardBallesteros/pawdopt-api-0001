require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const cookieParser = require("cookie-parser");

// const userController = require('./controller/user');
const galleryController = require('./controller/galleryController');
const usergalleryController = require('./controller/usergalleryController');
const volunteerController = require('./controller/volunteerController');
const handleFormSubmission  = require('./controller/formController');
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


//sign in, sign up, reset password for user
// app.post('/signup', userController.signup);
// app.post('/signin', userController.signin);
// app.post('/submit-otp', userController.submitotp);
// app.post('/send-otp', userController.sendotp);

//admin upload image crud
app.post('/api/upload',requireAuth , galleryController.upload.single('image'), galleryController.handleUpload);
app.get('/api/gallery', galleryController.getGallery);
app.put('/api/gallery/:id',requireAuth, galleryController.editImage);
app.delete('/api/gallery/:id',requireAuth, galleryController.deleteImage);

//user upload image
app.post('/api/user/upload',requireAuth, usergalleryController.upload.array('images', 5), usergalleryController.userHandleupload);
app.get('/api/user/gallery', usergalleryController.usergetGallery);
app.delete('/api/user/gallery/:id',requireAuth, usergalleryController.userdeleteImage);

//volunteer user
app.post('/api/volunteer-forms',requireAuth, volunteerController.volunteersubmitForm);

//admin approve and decline to volunteer form
app.get('/api/volunteer-forms-get', volunteerController.getVolunteerForms)
app.put('/api/volunteer-approve/:id', volunteerController.adminApproveForm);
app.delete('/api/volunteer-decline/:id', volunteerController.adminDeclineForm);

//contact us user
app.post('/api/contact-us',requireAuth ,handleFormSubmission.handleFormSubmission);
app.get('/api/contact-us-submissions/:id', handleFormSubmission.getFormSubmissionById);
//admin contact us
app.get('/api/contact-us-submissions',requireAuth, handleFormSubmission.getAllFormSubmissions);
app.put('/api/contact-us-approve/:id',requireAuth, handleFormSubmission.adminApproveAppointment);
app.delete('/api/contact-us-decline/:id',requireAuth, handleFormSubmission.adminDeclineAppointment);

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
