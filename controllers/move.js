const _ = require('lodash')
const moment = require('moment')


const config = require('../config')
const { Move } = require('../models/move')

// Sortable Attributes  
const sortableAttributes = ['created_at', 'sales', 'price']
// Validate Sort Key
const validSort = val => (sortableAttributes.indexOf(val) !== -1) ? val : false

const handleSpecialChars = val => val.replace(/[!@#$%^&*(),.?":{}|<>+-]/, t => `\\${t}`)

module.exports = {
	async getAll(req, res) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    const sort = validSort(req.query.sort) || 'created_at'
    const date = req.query.date
      ? req.query.date.split(',').map(d => (d && d.length ? d : null))
      : null
    const price = req.query.price
      ? req.query.price.split(',').map(d => (d ? parseInt(d, 10) : null))
      : null
    const desc = req.query.desc && req.query.desc !== 'yes' ? 1 : -1
    const stats = !!(req.query.stats && req.query.stats === 'yes')
    const external = !!(req.query.external && req.query.external === 'yes')
    const ignoreExternal = !!(
      req.query.ignore_external && req.query.ignore_external === 'yes'
    )
    const phone = req.query.phone || null
    const vendorName = req.query.vendor_name || null
    const category = req.query.category
      ? req.query.category.split(',').map(d => (d && d.length ? d : null))
      : null
    const categoryac = req.query.categoryac || null
    const brand = req.query.brand
      ? req.query.brand.split(',').map(d => (d && d.length ? d : null))
      : null
    const model = req.query.model
      ? req.query.model.split(',').map(d => (d && d.length ? d : null))
      : null
    const release = req.query.release
      ? req.query.release.split(',').map(d => (d && d.length ? d : null))
      : null
    const modelac = req.query.modelac || null
    const brandac = req.query.brandac || null
    const part = req.query.part || null
    const status = req.query.status ? req.query.status : null
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5
    const select = req.query.select
      ? req.query.select.split(',').join(' ')
      : null
    const filters = {}
    if (!ignoreExternal) {
      filters.external = external
    }
    if (phone && phone.length) {
      filters['item.vendor.phone'] = {
        $regex: new RegExp(handleSpecialChars(phone), 'i')
      }
    }
    if (vendorName && vendorName.length) {
      filters['item.vendor.name'] = {
        $regex: new RegExp(handleSpecialChars(vendorName), 'i')
      }
    }
    if (date) {
      if (date.length === 2) {
        if (date[0]) filters.created_at = { $gte: new Date(date[0]) }
        if (date[1])
          filters.created_at = date[0]
            ? { ...filters.created_at, $lte: new Date(date[1]) }
            : { $lte: new Date(date[1]) }
      }
    }
    if (categoryac && categoryac.length) {
      filters['item.category'] = {
        $regex: new RegExp(handleSpecialChars(categoryac), 'i')
      }
    } else if (category && category.length) {
      filters['item.category'] = { $in: category }
    }

    if (modelac && modelac.length) {
      filters['item.car_compatibility.model'] = {
        $regex: new RegExp(handleSpecialChars(modelac), 'i')
      }
    } else if (model && model.length) {
      filters['item.car_compatibility.model'] = { $in: model }
    }
    if (release && release.length) {
      filters['item.car_compatibility.release'] = { $in: release }
    }
    if (part && part.length) {
      filters['item.name'] = { $regex: new RegExp(handleSpecialChars(part), 'i') }
    }
    if (status) {
      filters.status = status
    }
    if (price) {
      if (price.length === 2) {
        filters['item.price'] = {}
        if (price[0]) filters['item.price'].$gte = price[0]
        if (price[1]) filters['item.price'].$lte = price[1]
      }
    }

    const count = await Move.find(filters)
    const pages = Math.ceil(count.length / limit, 10)
    const sorter = {}
    sorter[sort] = desc
    try {
      const move = stats
        ? null
        : await Move.find(filters)
            .select(select)
            .skip(page * limit)
            .limit(limit)
            .sort(sorter)
      const result = {
        move: stats ? count : move,
        page: stats ? null : page,
        pages: stats ? null : pages,
        limit: stats ? null : limit,
        stats,
        filters,
        totalPrice: _.sumBy(count, p => p.price)
      }
      return res.send(result)
    } catch (err) {
      return res.status(500).send(err)
    }
  },

	async add(req, res) {

			move = new Move({...req.body})
			await move.save()
			return res.send(move)
	},


	// Per One
	async getOne(req, res) {

		if (!req.params.id || !req.params.id.length) return res.status(400).send('Move number is required')

		const move = await Move.findOne({_id: req.params.id})
		if (!move) {
			return res.status(404).send('Move Not Found')
		}
		res.send(move)
	},

	async update(req, res) {
		// const { error } = ValidateMove(req.body, true) 
		// if (error) return res.status(400).send(error.details[0].message)
		const updated = await Move.findOneAndUpdate(
			{_id: req.params.id},
			{
				$set: req.body 
			},
			{
				new: true
			}
		)
		if (!updated) {
			return res.status(404).send('Move Not Found')
		}
		return res.send(updated)
	},
	async deleteMove(req, res) {
		const job = await Move.findById(req.params.id)
		if (!job) {
			return res.status(404).send('Move Not Found')
		}
		Move.deleteOne({ _id: req.params.id }, function(err) {
				   return res.send('Deleted')
		})
	}
}
