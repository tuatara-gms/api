
const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const appInstanceSchema = new mongoose.Schema({
	background: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 2000,
		default: '/background.jpg'
	},
	background_redirect: {
		type: Object,
		required: true,
		minlength: 1,
		maxlength: 2000,
		default: {
			url: null,
			placeholder: null,
			caption: null,
			btn_style: null
		}
	},
	facebook: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://www.facebook.com/'
	},
	twitter: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://twitter.com/'
	},
	instagram: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://www.instagram.com/'
	},
	socialmedia: {
		type: Object,
		minlength: 5,
		maxlength: 255,
		default: null
	},
	jobs_count: {
		type: Number,
		default: 0
	},
	vat: {
		type: Number,
		default: 0
	},
	currency: {
		type: String,
		default: 'LE'
	},
	title: {
		type: String,
		default: 'Tuatara Garage'
	},
	subtitle: {
		type: String,
		default: 'Coc, inc'
	},
	address: {
		type: String,
		default: 'Heliopoles, Egypt'
	},
	phones: {
		type: Array,
		default: ['01011133122']
	},
	promotions: {
		type: Array,
		default: []
	}
})


const AppInstance = mongoose.model('AppInstance', appInstanceSchema)

function validateAppInstance(appInstance) {
	const schema = {
		background: Joi.string().min(1).max(2000),
		jobs_count: Joi.number().min(0),
		background_redirect: Joi.object(),
		facebook: Joi.string().min(5).max(255),
		twitter: Joi.string().min(5).max(255),
		instagram: Joi.string().min(5).max(255),
		socialmedia: Joi.optional(),
		phones: Joi.optional(),
		address: Joi.optional(),
		promotions: Joi.optional(),
		title: Joi.optional(),
		subtitle: Joi.optional(),
		currency: Joi.optional(),
		vat: Joi.optional(),
	}
	return Joi.validate(appInstance, schema)
}

exports.AppInstance = AppInstance 
exports.validate = validateAppInstance