const _ = require('lodash')
const { Address, validateAddress, validateId, validate } = require('../../models/user/address')
const { User } = require('../../models/user')


module.exports = {
	async getAll(req, res) {
		const idError = validateId(req.params)
		if (idError.error) return res.status(400).send(error.details[0].message)

		const user = await User.findById(req.params.user)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		res.send(user.addresses)
	},
	async add(req, res) {
		const idError = validateId(req.params)
		if (idError.error) return res.status(400).send(error.details[0].message)

		const { error } = validate(req.body)
		if (error) return res.status(400).send(error.details[0].message)
		const user = await User.findById(req.params.user)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		// Check if the address Exists
		if (user.addresses.filter(adress => (adress.name === req.body.name)).length) {
			return res.status(400).send('This Address Already Exists')
		}
		user.addAddress(req.body)
		await User.findOneAndUpdate({_id: req.params.user},
			{
				$set: user
			},
			{
				new: true
			})
		res.send(user)
	},


	// Per One
	async getOne(req, res) {
		const { error } = validateId(req.params)
		if (error) return res.status(400).send(error.details[0].message)

		const address = await Address.findById(req.params.id)
		if (!address) {
			return res.status(404).send('Address Not Found')
		}
		res.send(address)
	},
	async update(req, res) {
		const { error } = validate(req.body)
		if (error) return res.status(400).send(error.details[0].message)
		const updated = await Address.findOneAndUpdate(
			req.params.id,
			{
				$set: req.body 
			},
			{
				new: true
			}
		)
		if (!updated) {
			return res.status(404).send('Address Not Found')
		}
		return res.send(updated)
	},
	findAddress(req, res){
	    var regex = new RegExp(req.query.q, 'i')
	    return Address.find({name: regex}, function(err,q){
			return res.send(q)
		})
	},
	async deleteAddress(req, res) {

		if (!req.params.user || !req.params.addressid ) {
			return res.status(404).send('Invalid Request')
		}

		const user = await User.findById(req.params.user)
		if (!user) {
			return res.status(404).send('User Not Found')
		}

		const address = await user.addresses.filter(a => a._id == req.params.addressid)
		if (!address.length) {
			return res.status(404).send('Address Not Found')
		}

		const updated = await User.findOneAndUpdate({_id: req.params.user},
			{
				$set: {
					addresses: user.addresses.filter(a => a._id != req.params.addressid)
				}
			},
			{
				new: true
			})
		res.send(updated)
	}
}
