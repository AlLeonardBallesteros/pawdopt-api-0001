const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = async (req, res, next) => {
  // verify if the user is authenticated
  const { authorization } = req.headers

  // if authorization token is missing, return 401 Unauthorized error
  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    // verifying the JWT token using the secret key
    const { _id } = jwt.verify(token, process.env.SECRET)
    // find the user associated with the token and attach it to the request object
    // para kapag si user 1 nag add ng task di makikita yun ni user 2
    req.user = await User.findOne({ _id }).select('_id')
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = requireAuth