const {OAuth2Client} = require('google-auth-library')
const {User} = require('../../models/user')
const config = require('../../config')

class GoogleAuth {
	constructor() {
		const gClientId = config.google.appId
		this.google = {
			client_id: gClientId,
			client: new OAuth2Client(gClientId),
		}
	}

	async _verifyGoogleToken(token) {
		return this.google.client.verifyIdToken({
			idToken: token,
			audience: this.google.client_id,
		})
	}

	async getClientData(token) {

		const ticket = await this._verifyGoogleToken(token)
		const payload = await ticket.getPayload()

		return {
			email: payload.email,
			first_name: payload.given_name,
			last_name: payload.family_name,
			mobile: token.mobile,
			image: payload.picture,
			auth_type: 'google',
			is_active: true,
			is_mobile_verified: true,
			is_email_verified: true,
			is_verified: true,
			google: {
				id: payload.sub,
			},
		}
	}
}


module.exports = new GoogleAuth()