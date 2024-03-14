const jwt = require('jsonwebtoken');
const User = require('../models/user');


const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

const login = async (req, res) => {
  const {email, password, role} = req.body


  try {
    const user = await User.login(email, password, role)

    // create a token
    const token = createToken(user._id);
  
    
    res.status(200).json({email, token, role: user.role})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}
const register = async (req, res) => {
  const {firstname, lastname, email, password} = req.body

  try {
    const user = await User.register(firstname, lastname, email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}



module.exports = {login, register}
