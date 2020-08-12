const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const {User} = require('../../models/user')
const config = require('../../config')
const google = require('./google')
const facebook = require('./facebook')
const picks = ['_id', 'name', 'email', 'roles', 'avatar', 'points', 'auth_type', 'social', 'addresses', 'phone', 'blocked']
const controller = {
	async google() {
		return  {
			client_id: config.google.appId,
			client: new OAuth2Client(config.google.appId),
		}
	},
	async _verifyGoogleToken(idToken) {
		return await this.google().client.verifyIdToken({
			idToken,
			audience: this.google().clientId,
		})
	},
	async post (req, res){
		const { error } = validate(req.body) 
		if (error) return res.status(400).send(error.details[0].message)

		let user = await User.findOne({ email: req.body.email, auth_type: 'local' }).select([...picks, 'password'].join(' '))
		if (!user) return res.status(400).send('Invalid email or password.')

		const validPassword = await bcrypt.compare(req.body.password, user.password)
		if (!validPassword) return res.status(400).send('Invalid email or password.')

		const token = await user.generateAuthToken()
		return res.send({...(_.pick(user._doc, picks)), token})
	},
	async googleAuth(req, res) {
		if (!req.body.idtoken) {
			return res.status(400).send('Bad Request')
		}
		const data = await google.getClientData(req.body.idtoken) 

		let user = await User.findOne({ email: data.email })
		// Login If Exists
		if (user) {
			const token = user.generateAuthToken()
			return res
		        .header('Authorization', token)
		        .send({ new: false, token, ...(_.pick(user, picks))})
		}
		// Register If Not Exsist
	    const computedUser = _.pick(data, ['email', 'auth_type'])
	    computedUser.is_verified = { email: true, verified: true }
	    computedUser.name = `${data.first_name} ${data.last_name}`
	    computedUser.avatar = data.image
	    computedUser.social = data.google
	    computedUser.roles = ['client']
		user = new User(computedUser)
		await user.save()

		const token = user.generateAuthToken()
		return res
		        .header('Authorization', token)
		        .send({ new: true, token, ...(_.pick(user, picks))})
	},

	async facebookAuth(req, res) {
		if (!req.body.token) {
			return res.status(400).send('Bad Request')
		}
		// return res.send(facebook)
		const data = await facebook.getClientData(req.body) 
		let user = await User.findOne({ email: data.email })
		// Login If Exists
		if (user) {
			const token = user.generateAuthToken()
			return res
		        .header('Authorization', token)
		        .send({ new: false, token, ...(_.pick(user, picks))})
		}
		// Register If Not Exsist
	    const computedUser = data
	    computedUser.roles = ['client']
		user = new User(computedUser)
		await user.save()

		const token = user.generateAuthToken()
		return res
		        .header('Authorization', token)
		        .send({ new: true, token, ...(_.pick(user, ['_id', 'name', 'email', 'roles', 'avatar', 'points', 'auth_type','social']))})
	}
}



function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required()
	}

	return Joi.validate(req, schema)
}

module.exports = controller