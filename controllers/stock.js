const _ = require('lodash')
const moment = require('moment')

const config = require('../config')
const { Stock } = require('../models/stock')
const { Move } = require('../models/move')

// Sortable Attributes
const sortableAttributes = ['created_at', 'price']
// Validate Sort Key
const validSort = val => (sortableAttributes.indexOf(val) !== -1 ? val : false)

const handleSpecialChars = val =>
  val.replace(/[!@#$%^&*(),.?":{}|<>+-]/, t => `\\${t}`)

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
    const nonExternal = !!(
      req.query.non_external && req.query.non_external === 'yes'
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
    if (!nonExternal || !external) {
      filters.external = external
    }
    if (phone && phone.length) {
      filters['vendor.phone'] = {
        $regex: new RegExp(handleSpecialChars(phone), 'i')
      }
    }
    if (vendorName && vendorName.length) {
      filters['vendor.name'] = {
        $regex: new RegExp(handleSpecialChars(vendorName), 'i')
      }
    }
    if (date) {
      if (date.length === 2) {
        if (date[0]) filters.created_at = { $gte: new Date(date[0]) }
        if (date[1])
          filters.created_at = date[0]
            ? { ...filters.timein, $lte: new Date(date[1]) }
            : { $lte: new Date(date[1]) }
      }
    }
    if (categoryac && categoryac.length) {
      filters['category'] = {
        $regex: new RegExp(handleSpecialChars(categoryac), 'i')
      }
    } else if (category && category.length) {
      filters['category'] = { $in: category }
    }

    if (modelac && modelac.length) {
      filters['car_compatibility.model'] = {
        $regex: new RegExp(handleSpecialChars(modelac), 'i')
      }
    } else if (model && model.length) {
      filters['car_compatibility.model'] = { $in: model }
    }
    if (release && release.length) {
      filters['car_compatibility.release'] = { $in: release }
    }
    if (part && part.length) {
      filters['name'] = { $regex: new RegExp(handleSpecialChars(part), 'i') }
    }
    if (status) {
      filters.status = status
    }
    if (price) {
      if (price.length === 2) {
        filters['price'] = {}
        if (price[0]) filters['price'].$gte = price[0]
        if (price[1]) filters['price'].$lte = price[1]
      }
    }

    // Removing Trashed and Hidden Stock
    filters.trashed = false
    filters.hidden = false

    const count = await Stock.find(filters)
    const pages = Math.ceil(count.length / limit, 10)
    const sorter = {}
    sorter[sort] = desc
    try {
      const stock = stats
        ? null
        : await Stock.find(filters)
            .select(select)
            .skip(page * limit)
            .limit(limit)
            .sort(sorter)
      const result = {
        stock: stats ? count : stock,
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
    stock = new Stock({ ...req.body })
    await stock.save()
    const move = await new Move({
        item: {
          ...stock,
          makeMove: true,

        },
        job: null,
        count: req.body.count,
        type: 'import',
        price:
          parseFloat(stock.count, 10) *
          parseFloat(stock.import_price, 10)
      })
      await move.save()
    return res.send(stock)
  },

  // Per One
  async getOne(req, res) {
    if (!req.params.id || !req.params.id.length)
      return res.status(400).send('Stock number is required')

    const stock = await Stock.findOne({ _id: req.params.id })
    if (!stock) {
      return res.status(404).send('Stock Not Found')
    }
    res.send(stock)
  },

  async stockMove(req, res) {
    // // await Stock.updateMany({}, { $inc: { imports: _.random(100, 2000), exports: _.random(100, 2000) } })
    // const all = await Stock.find({})
    // let m 
    // for(m = 0; m < all.length; m += 1) {
    //   await Stock.findOneAndUpdate({ _id: all[m]._id }, { $inc: { import_price: _.random(100, 1000), price: _.random(100, 2000) } })
    // }
    try {
      const findCheck = await Stock.find({ _id: req.body.item._id, trashed: false  })
      if (!findCheck) {
        return res.status(404).send('Stock Not Found, it could be trashed.')
      }
      const inc = req.body.count
      const updated = await Stock.findOneAndUpdate(
        { _id: req.body.item._id, trashed: false  },
        { 
          $inc: { 
            count: inc,
            imports: Math.max(0, inc),
            exports: Math.min(0, inc) * -1
           }
          },
        { new: true }
      )
      const move = await new Move({
        item: req.body.item,
        job: null,
        type: req.body.count > 0 ? 'import' : 'export',
        count: req.body.count,
        price:
          Math.abs(parseFloat(req.body.count, 10)) *
          parseFloat(req.body.count > 0 ? updated.import_price : updated.price, 10)
      })
      await move.save()
      return res.send(updated)
    } catch (err) {
      return res.status(500).send(err)
    }
  },
  async update(req, res) {
    // const { error } = ValidateStock(req.body, true)
    // if (error) return res.status(400).send(error.details[0].message)
    const updated = await Stock.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body
      },
      {
        new: true
      }
    )
    if (!updated) {
      return res.status(404).send('Stock Not Found')
    }
    return res.send(updated)
  },
  async deleteStock(req, res) {
    const job = await Stock.findById(req.params.id)
    if (!job) {
      return res.status(404).send('Stock Not Found')
    }
    Stock.deleteOne({ _id: req.params.id }, function(err) {
      return res.send('Deleted')
    })
  }
}
