const jwt = require('jsonwebtoken')
const userSchema = require('../models/user')


module.exports = async (req, res, next) => {
  let token = req.headers.authorization
  try {
    if (!token || !token.includes('Bearer')) {
      console.log('error', 'Authorization token is missing.')
      return res.status(401).json({ suceess: false, msg: 'User is not authorized.', data: {} })
    }
    token = token.split(' ')[1]
    const decodedtoken = jwt.decode(token, { complete: true })
    if (!decodedtoken) {
      console.log('error', 'Token is not decoded!')
      return res.status(401).json({ suceess: false, msg: 'User is not authorized.', data: {} })
    }
    if (new Date(decodedtoken.payload.expiresIn) < new Date()) {
      console.log('error', 'Token Expired')
      return res.status(401).json({ success: false, msg: 'Token Expired', data: {} })
    }
    const id = decodedtoken.payload.id
    const user = await userSchema.findOne({ _id: id })
    if (!user) return res.status(401).json({ suceess: false, msg: 'User is not authorized.', data: {} })
    req.userId = decodedtoken.payload.id
    req.userRole = decodedtoken.payload.role
    return next()
  } catch (e) {
    return res.status(401).json({ suceess: false, msg: 'User is not authorized.', data: {} })
  }
}
