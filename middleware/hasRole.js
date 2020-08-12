const isAdmin = ({ roles }) => roles.indexOf('admin') !== -1
module.exports = (roles, user) => {
	if (!user || typeof user !== 'object' || !user.roles) {
		return false
	}
	if (!roles) {
		return true
	}
	if (isAdmin(user)) {
		return true
	}
	if (typeof roles === 'string') {
		return user.roles.indexOf(roles) !== -1
	}
	if (typeof roles === 'object' && Array.isArray(roles)) {
		let i
		for (i = 0; i < roles.length; i += 1) {
			if (user.roles.indexOf(roles[i]) === -1) {
				return false
			}
		}
		return true
	}
	return false
}