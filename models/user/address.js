const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
	default: { type: Boolean },
	name: { type: String, trim: true },
	type: { type: String, trim: true },
	country: { type: String, trim: true },
	city: { type: String, trim: true },
	area: { type: String, trim: true },
	street: { type: String, trim: true },
	building: { type: String, trim: true },
	floor: { type: String, trim: true },
	text_data: { type: Object },
	apartment: { type: String, trim: true },
	mobile: { type: String, trim: true },
	lat: { type: Number, require: false , default: null},
	long: { type: Number, require: false , default: null},
	landmark: { type: String, trim: true },
	shipping_note: { type: String, trim: true },
})

const Address = mongoose.model('Address', addressSchema)

function validateAddress(address) {
	const schema = {
		name: Joi.string().min(1).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		default: Joi.boolean().required(),
		type: Joi.string().min(1).max(50).required(),
		country: Joi.string().min(1).max(50).required(),
		city: Joi.string().min(1).max(255).required(),
		area: Joi.string().min(1).max(255).required(),
		street: Joi.string().min(1).max(255).required(),
		building: Joi.string().min(1).max(50).required(),
		floor: Joi.string().min(1).max(10).required(),
		apartment: Joi.string().min(1).max(10).required(),
		mobile: Joi.string().min(5).max(50).required(),
		text_data: Joi.object(),
		lat: Joi.number(),
		long: Joi.number(),
		landmark: Joi.string().min(1).max(225),
		shipping_note: Joi.string().min(1).max(255).optional()
	}

	return Joi.validate(address, schema)
}

function validateId(body) {
	return Joi.validate(body, { user: Joi.objectId().required() })
}

exports.Address = Address 
exports.addressSchema = addressSchema
exports.validate = validateAddress
exports.validateId = validateId