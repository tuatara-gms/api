const config = require('../../config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const { addressSchema , Address } = require('./address')
const getAvatar = val => {
	return val ? `http://127.0.0.1:8080/${val}` : null
}
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	auth_type: {
		type: String,
		required: true,
		default: 'local'
	},
	social: {
		type: Object,
		default: {
			id: null
		}
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		minlength: 5,
		maxlength: 1024,
		select: false
	},
	avatar: {
		type: mongoose.Schema.Types.Mixed,
		default: null
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	},
	roles: {
		type: Array,
		required: true,
		default: ['client']
	},
	gender: {
		type: String,
		minlength: 5,
		maxlength: 50,
		default: null
	},
	phone: {
		type: String,
		minlength: 5,
		maxlength: 50,
		default: null
	},
	is_verified: {
		type: Object,
		required: true,
		default: { email: false, verified: false },
	},
	blocked: {
		type: Boolean,
		default: false
	},
	points: {
		type: Number,
		default: 0,
	},
	addresses: {
		type: [addressSchema],
		required: false,
		default: []
	},
	wishlist: {
		type: Array,
		default: [],
		required: false
	}
})
userSchema.set('toObject', { getters: true })
userSchema.set('toJSON', { getters: true })
userSchema.methods.generateAuthToken = function() { 
	const token = jwt
		.sign( _.pick(this, ['_id', 'roles', 'email', 'is_verified', 'auth_type', 'blocked']), config.jwtPrivateKey)
	return token
}

userSchema.methods.getUser = function() {
	let temp = this
	temp.avatar = getAvatar(temp.avatar)
	return temp
}

userSchema.methods.addAddress = async function(address) {
	try {
		const newAddress = new Address(address)
		 const query = { _id: this._id }
		this.addresses.push(newAddress)
		return true
	} catch (err) {
		return err
	}
}

const User = mongoose.model('User', userSchema)

function validateUser(user, idRequired = false) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),	
		email: Joi.string().email().required(),
		roles: Joi.array().min(1).items(Joi.string().valid('client', 'admin', 'stocks', 'jobs')),
		phone: Joi.string().min(5).max(20).allow(null),
		gender: Joi.string().min(3).max(50).allow(null),
		points: Joi.number().min(0),
		is_verified: Joi.optional(),
		auth_type: Joi.optional(),
		wishlist: Joi.array(),
		blocked: Joi.optional(),
		social: Joi.optional(),
		created_at : Joi.optional(),
		_id : Joi.optional(),
		id : Joi.optional(),
		__v : Joi.optional(),
		_id: Joi.objectId()
	}
	if(idRequired) {
		schema._id = Joi.objectId().required()
	} else {
		schema.password = Joi.string().min(5).max(255).required()
		Joi.string().min(5).max(255).required().email()
	}
	return Joi.validate(user, schema)
}
function validateId(body) {
	return Joi.validate(body, { id: Joi.objectId().required() })
}
exports.User = User 
exports.validateId = validateId
exports.validate = validateUser