const FormSubmission = require('../models/formsubmitModel');


//admin
// all form
const getAllFormSubmissions = async (req, res) => {
  try {
    const usermessages = await FormSubmission.find();
    res.json(usermessages);
  } catch (error) {
    console.error('Error fetching all Appointment forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//user
// single form
const getFormSubmissionById = async (req, res) => {
  const { id }= req.params.id;

  try {
    const formSubmission = await FormSubmission.findById(id);
    if (!formSubmission) {
      return res.status(404).json({ error: 'Form submission not found' });
    }

    res.json(formSubmission);
  } catch (error) {
    console.error('Error fetching form submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const handleFormSubmission = async (req, res) => {
  try {
  const user_id = req.user._id
  const { name, email, time, date, message } = req.body;
  const newFormSubmission = new FormSubmission({name, email, time, date, message, user_id});

  await newFormSubmission.save();

  res.json({ message: 'Contact us form submitted successfully' });
} catch (error) {
  console.error('Error submitting Appointment form:', error);
  res.status(500).json({ error: 'Internal server error' });
}
};

const adminApproveAppointment = async (req, res) => {
  const id = req.params.id
  try {
    const usermessages = await FormSubmission.findById(id);
    if (!usermessages) {
      return res.status(404).json({ error: 'Appointment form not found' });
    }

    // Update the status to 'approved'
    usermessages.status = 'approved';
    await usermessages.save();

    res.json({ message: 'Appoinrment form approved successfully' });
  } catch (error) {
    console.error('Error approving Appointment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin decline endpoint
const adminDeclineAppointment = async (req, res) => {
  const id = req.params.id;

  try {
    const usermessages = await FormSubmission.findOneAndUpdate(
      { _id: id },
      { $set: { status: 'declined' } },
      { new: true }
    );

    if (!usermessages) {
      return res.status(404).json({ error: 'Volunteer form not found' });
    }

    res.json({ message: 'Volunteer form declined successfully' });
  } catch (error) {
    console.error('Error declining Appointment form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { handleFormSubmission, getAllFormSubmissions, adminDeclineAppointment, adminApproveAppointment, getFormSubmissionById };