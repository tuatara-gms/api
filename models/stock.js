const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const moment = require('moment')
require('moment-timezone')
const car_compatibility = new mongoose.Schema({
	brand: { type: String, default: 'BMW'},
	model: { type: String, default: 'M3' },
	release:{ type: Number, default:  2019 }
})
const stock = new mongoose.Schema({
	name: {
		type: String,
		default: 'Mobile Engine Oil x5'
	},
	category: {
		type: String,
		default: 'Engine Oil'
	},
	vendor: {
		type: Object,
		default: null,
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
	import_price: {
		type: Number,
		default: 0,
		min: 0
	},
	count: {
		type: Number,
		default: 0
	},
	points: {
		type: Number,
		default: 0
	},
	imports: {
		type: Number,
		default: 0
	},
	exports: {
		type: Number,
		default: 0
	},
	notes: {
		type: String,
		default: null
	},
	status: {
		type: String,
		default: 'instock'
	},
	car_compatibility: {
		type: [ car_compatibility ],
		type: Array,
		default: []
	},
	external: {
		type: Boolean,
		default: false
	},
	trashed: {
		type: Boolean,
		default: false
	},
	hidden: {
		type: Boolean,
		default: false
	},
	quick_add: {
		type: Boolean,
		default: false
	}
})



const Stock = mongoose.model('stock', stock)
exports.Stock = Stock 