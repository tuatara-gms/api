const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const moment = require('moment')
require('moment-timezone')

const job = new mongoose.Schema({
	client: {
		type: Object,
		default: {
			phone: '+201011133122',
			name: 'Jhon Doe'
		},
	},
	timein: {
		type: Date,
		default: moment.tz('UTC').toDate()
	},
	requirements: {
		type: Array,
		default: []
	},
	timeleave: {
		type: Date,
		default: null
	},
	price: {
		type: Number,
		default: 0,
		min: 0
	},
	job_no: {
		type: Number,
		default: 0
	},
	notes: {
		type: String,
		default: null
	},
	status: {
		type: String,
		default: 'running'
	},
	car: {
		type: Object,
		default: {
			brand: 'BMW',
			model: 'M3',
			release: 2019,
			chase: '1234',
			kilometers: '120000'
		}
	},
	complain: {
		type: String,
		default: null
	},
	operations: {
		type: Array,
		default: []
	},
	reciptionist: {
		type: String,
		default: null,
	},
	promotion: {
		type: String,
		default: null
	},
	promotion_data: {
		type: Object,
		default: null
	},
	vat: {
		type: Number,
		default: 0
	},
	applied_vat: {
		type: Number,
		default: 0
	},
	apply_vat: {
		type: Boolean,
		default: true
	}
})

function validateJob(job, update = false) {
	const schema = {
		car: Joi.object().required().keys({
			brand: Joi.string().min(1).max(255),
			model: Joi.string().min(1).max(255),
			kilometers: Joi.string().min(1).max(255).optional(),
			chase: Joi.string().min(1).max(255).optional(),
			release: Joi.string().max(4).min(4).required()
		}),
		client: Joi.object().required().keys({
			name: Joi.string().min(1).max(255),
			phone: Joi.string().min(1).max(255)
		}),
		reciptionist: Joi.string().min(1).max(255),
		requirements: Joi.array().optional(),
		timein: Joi.optional(),
		timeleave: Joi.optional(),
	}
	if (update) {
		schema.complain = Joi.string().max(255).allow('').optional()
		schema.notes = Joi.string().max(255).allow('').optional()
		schema.status = Joi.string().min(1).max(255)
		schema.operations = Joi.array()
		schema.promotion = Joi.optional()
		schema.vat = Joi.optional()
		schema.applied_vat = Joi.optional()
		schema.apply_vat = Joi.optional()
		schema.price = Joi.optional()
		schema.promotion_data = Joi.optional()
	}
	return Joi.validate(job, schema)
}

const Job = mongoose.model('job', job)
exports.Job = Job 
exports.ValidateJob = validateJob