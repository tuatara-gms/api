const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const moment = require('moment')
require('moment-timezone')

const moves = new mongoose.Schema({
	item: {
		type: Object,
		default: {
			name: 'Item',
			price: 10,
			points: 0,
			external: false
		}
	},
	created_at: {
		type: Date,
		default: moment.tz('UTC').toDate()
	},
	price: {
		type: Number,
		default: 0,
		min: 0
	},
	job: {
		type: Object,
		default: null
	},
	count: {
		type: Number,
		default: 0
	},
	notes: {
		type: String,
		default: null
	},
	type: {
		type: String,
		default: 'import'
	},
	by: {
		type: Object,
		default: null
	}
})



const Move = mongoose.model('moves', moves)
exports.Move = Move