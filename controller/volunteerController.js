const Volunteer = require('../models/Volunteer');

const volunteersubmitForm = async (req, res) => {
  try {
    const { name, contact, location, availability, skills, message } = req.body;

    const newVolunteer = new Volunteer({
      name,
      contact,
      location,
      availability,
      skills,
      message,
      status: 'pending', // Set the initial status to 'pending'
    });

    await newVolunteer.save();

    res.json({ message: 'Volunteer form submitted successfully' });
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin approval endpoint
const adminApproveForm = async (req, res) => {
  const formId = req.params.id;

  try {
    const volunteerForm = await Volunteer.findById(formId);
    if (!volunteerForm) {
      return res.status(404).json({ error: 'Volunteer form not found' });
    }

    // Update the status to 'approved'
    volunteerForm.status = 'approved';
    await volunteerForm.save();

    res.json({ message: 'Volunteer form approved successfully' });
  } catch (error) {
    console.error('Error approving volunteer form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin decline endpoint
const adminDeclineForm = async (req, res) => {
  const formId = req.params.id;

  try {
    const volunteerForm = await Volunteer.findOneAndUpdate(
      { _id: formId },
      { $set: { status: 'declined' } },
      { new: true }
    );

    if (!volunteerForm) {
      return res.status(404).json({ error: 'Volunteer form not found' });
    }

    res.json({ message: 'Volunteer form declined successfully' });
  } catch (error) {
    console.error('Error declining volunteer form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getVolunteerForms = async (req, res) => {
  try {
    const volunteerForms = await Volunteer.find();
    res.json(volunteerForms);
  } catch (error) {
    console.error('Error fetching all volunteer forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { volunteersubmitForm, adminApproveForm, adminDeclineForm, getVolunteerForms };
