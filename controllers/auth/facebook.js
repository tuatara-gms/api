const request = require('superagent')
const util = require('util')
const _ = require('lodash')
const facebookAPI = 'https://graph.facebook.com/v3.0/me?fields=id,email,first_name,last_name,picture&access_token=%s'
const controller = {
	async getClientData(body) {
		try {
			const data = body

			if (_.isNil(data.token)) {
				throw new this.ValidationError(0, 'Missing authorization token')
				return
			}

			const rUri = util.format(facebookAPI, data.token)
			const rData = await request.get(rUri).accept('json')
			const facebookUser = rData.body

			return {
				email: facebookUser.email,
				name: `${facebookUser.first_name} ${facebookUser.last_name}`,
				avatar: facebookUser.picture.data.url,
				mobile: data.mobile,
				auth_type: 'facebook',
				social: {
					id: facebookUser.id
				},
				is_verified: {
					email: true,
					verified: true
				}
			}
		} catch (err) {
			throw err
			return
		}
	}
}

module.exports = controller