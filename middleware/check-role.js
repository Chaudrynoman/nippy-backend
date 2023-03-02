exports.checkRole = (role) => [
    (request, response, next) => {
      if (role === request.userRole) next()
      else return response.status(403).json({ suceess: false, msg: 'User is not authorized.', data: {} })
    }
  ]