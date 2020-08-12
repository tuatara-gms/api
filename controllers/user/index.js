const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const config = require('../../config')
const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const {User, validate, validateId} = require('../../models/user')
const { uploadAvatar } = require('../../middleware/multer')
// const mongoose = require('mongoose');

const generateFileName = (req, file, data) => {
	return [
		data,
		path.extname(file.originalname)
	].join('')
}
const getFilePath = name => path.resolve(`storage/avatar/${name}`)
module.exports = {

	// Get All

	async getAll(req, res) {
		const page = req.query.page ? parseInt(req.query.page, 10) : 0
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10
		const select = req.query.select ? req.query.select.split(',').filter(i => i !== 'password').join(' ') : null
		const count = await User.find({})
		const pages = Math.ceil(count.length / limit, 10)
		const users = await User.find({})
		    .select(select)
			.skip(page * limit)
			.limit(limit)
		const result = {
			users,
			page,
			pages,
			limit
		}
		res.send(result)
	},

	async search(req, res) {
		const name = req.query.name || ''
		const email = req.query.email || null
		const roles = req.query.roles ? req.query.roles.split(',') : null
		const page = req.query.page ? parseInt(req.query.page, 10) : 0
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10
		const select = req.query.select ? req.query.select.split(',').filter(i => i !== 'password').join(' ') : null
		const selectFilter = {
			name: {  $regex: new RegExp(name, 'i') },
		}
		if (roles) {
			selectFilter.roles = { $in: roles }
		}
		if (email) {
			selectFilter.email = email
		}
		const count = await User.find(selectFilter)
		const pages = Math.ceil(count.length / limit, 10)
		const users = await User.find(selectFilter)
		    .select(select)
			.skip(page * limit)
			.limit(limit)
		const result = {
			users,
			page,
			pages,
			limit
		}
		res.send(result)
	},

	// Add Client User

	async register(req, res) {
		const { error } = validate(req.body) 
		if (error) return res.status(400).send(error.details[0].message)

	    const allUsers = await User.find({})
	    const roles = allUsers.length ? ['client'] : ['admin']

		let user = await User.findOne({ email: req.body.email })
		if (user) return res.status(400).send('User already registered.')

		user = new User({
			...(_.pick(req.body, ['name', 'email', 'password'])),
			roles
		})
		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(user.password, salt)
		await user.save()

		const token = user.generateAuthToken()
		res.header('Authorization', token).send({ token, ...(_.pick(user, ['_id', 'name', 'email', 'roles', 'avatar', 'points']))})
	},

	// Add Admin

	async registerAdmin (req, res) {
		const { error } = validate(req.body) 
		if (error) return res.status(400).send(error.details[0].message)

		let user = await User.findOne({ email: req.body.email })
		if (user) return res.status(400).send('User already registered.')

		user = new User({
			roles: ['admin'],
			...(_.pick(req.body, ['name', 'email', 'password', 'roles']))
		})
		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(user.password, salt)
		await user.save()

		const token = user.generateAuthToken()
		res.send({ token, ...(_.pick(user, ['_id', 'name', 'email', 'roles', 'avatar', 'points'])) })
	},

	// Per One

	async getOne(req, res) {
		const { error } = validateId(req.params)
		if (error) return res.status(400).send(error.details[0].message)

		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		res.send(user)
	},

	// Update user

	async update(req, res) {
		const { oIdError } = validateId(req.params) 
		if (oIdError) return res.status(400).send(error.details[0].message)
		const { error } = validate(req.body, true) 
		if (error) return res.status(400).send(error.details[0].message)
		// Decode Token
		const token = req.header('Authorization')
		const decoded = jwt.verify(token, config.jwtPrivateKey)
		// Validate Update Previllage
		if (decoded.roles.indexOf('admin') !== -1 || req.params.id === decoded._id) {
			const picks = ['name', 'phone', 'gender', 'points', 'whishlist', 'email']
			const updates = _.pick(req.body, picks)
			// Add Roles if Admin
			if (req.body.roles && decoded.roles.indexOf('admin') !== -1) {
				updates.roles = req.body.roles
				if (req.body.blocked !== undefined) {
				    updates.blocked = req.body.blocked
				} 
				if (req.body.is_verified !== undefined) {
				    updates.is_verified = req.body.is_verified
				    if (typeof updates.is_verified.email === 'string') {
				    	updates.is_verified.email = updates.is_verified.email == 'true'
				    }
				    if (typeof updates.is_verified.verified === 'string') {
				    	updates.is_verified.verified = updates.is_verified.verified == 'true'
				    }
				    if (typeof updates.blocked === 'string') {
				    	updates.is_verified.verified = updates.blocked == 'true'
				    }
				} 
			}
			const user = await User.findOneAndUpdate({ _id: req.params.id},
				updates, { new: true })
			if (!user) return res.status(404).send('User Not Found.')
			return res.send(user)
		}
		return res.status(401).send('Unauthorized')
	},

	// Update Self

	async updateSelf(req, res) {
		const { oIdError } = validateId(req.params) 
		if (oIdError) return res.status(400).send(error.details[0].message)
		const { error } = validate(req.body, true) 
		if (error) return res.status(400).send(error.details[0].message)
		// Decode Token
		const token = req.header('Authorization')
		const decoded = jwt.verify(token, config.jwtPrivateKey)
		// Validate Update Previllage
		const updates = _.pick(req.body, ['name', 'phone', 'gender', 'points', 'whishlist'])
		const user = await User.findOneAndUpdate({ _id: decoded._id},
			updates, { new: true })
		if (!user) return res.status(404).send('User Not Found.')
		return res.send(user)
		return res.status(401).send('Unauthorized')
	},

	// Get User By Email

	async getByEmail(req, res) {
		if(!req.query || !req.query.email) {
			return res.status(400).send('No Email Provided.')
		}
		let user = await User.findOne({ email: req.query.email })
		if (user) return res.send(user)
		res.status(404).send('User Does Not Exist.')
	},

	async emailAvailable (req, res)  {
		if(!req.query || !req.query.email) {
			return res.status(400).send('No Email Provided.')
		}
		let user = await User.findOne({ email: req.query.email })
		if (user) return res.status(400).send('Email is not available.')
		return res.send('OK')
  
	},

	// Who Am I
	async me (req, res){
		const user = await User.findById(req.user._id).select('-password')
		res.send(user)
	},

	/// Add User Avatar

	async addAvatar(req, res) {
		const { error } = validateId(req.params)
		if (error) return res.status(400).send(error.details[0].message)

		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		// Remove The Old Avatar
		if(user.avatar) {
			fs.unlink(getFilePath(user.avatar), err => {
				if (err) {
					return res.status(500).send('Something Went Wrong')
				}
			})
		}
		const filename = (req, file, cb) => {
			cb(null, generateFileName(req, file ,user._id))
		}
		uploadAvatar({filename}).single('file')(req, res, async error => {
			if (error) {
				return res.status(500).send('Something Went Wrong')
			}
			if (!req.file) {
				return res.status(400).send('No Files Selected')
			}
			const avatar = generateFileName(req, req.file,user._id)
			const updated = await User.findOneAndUpdate(
				{_id: req.params.id},
				{
					$set: { avatar }
				},
				{
					new: true
				}
			)
			return res.send(updated)
		})
	},

	// Remove Avatar

	async removeAvatar(req, res) {
		const { error } = validateId(req.params)
		if (error) return res.status(400).send(error.details[0].message)

		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		// Remove The Old Avatar
		if(user.avatar) {
			fs.unlink(getFilePath(user.avatar), err => {
				if (err) {
					return res.status(500).send('Something Went Wrong')
				}
			})
		} else {
			return res.status(404).send('No Avatar Found')
		}
		const updated = await User.findOneAndUpdate(
			req.params.id,
			{
				$set: { avatar: null }
			},
			{
				new: true
			}
		)
		return res.send(updated)
	},

	// Get User Avatar

	async getAvatar(req, res) {
		const { error } = validateId(req.params)
		if (error) return res.status(400).send(error.details[0].message)
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).send('User Not Found')
		}
		if(user.avatar) {
			return res.set({
				'Content-Type': mime.lookup(path.extname(user.avatar)),
				'Content-Disposition': `inline; filename="${user.name}${path.extname(user.avatar)}"`
			}).sendFile(getFilePath(user.avatar))
		} 

		res.status(404).send('Avatar Not Found')
	}


}
