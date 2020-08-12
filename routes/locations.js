const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const locationsController = require('../controllers/locations')

// Get
router.get('/countries' ,locationsController.getCountries)

// Get Cities
router.get('/countries/:country/cities' ,locationsController.getCities)

module.exports = router 
