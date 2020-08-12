const jwt = require('jsonwebtoken')
const config = require('../config')
const hasRole = require('./hasRole')

module.exports = function(roles = null) {
	return function (req, res, next) {
		const token = req.header('Authorization')
		if (!token) return res.status(401).send('Access denied. No token provided.')

		try {
			const decoded = jwt.verify(token, config.jwtPrivateKey)
			req.user = decoded

			if(!hasRole(roles, decoded)) {
				return res.status(401).send(decoded)
			} else {
				next()
			}
		}
		catch (ex) {
			res.status(401).send('Invalid token.')
		}
	}
}