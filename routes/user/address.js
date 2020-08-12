const auth = require('../../middleware/auth')
const express = require('express')
const router = express.Router()
const addressController = require('../../controllers/user/address')
const Countries = require('../../resources/countries')


// All Addresses
router.get('/:user', auth() ,addressController.getAll)

// Add Address
router.post('/:user', auth() ,addressController.add)

// Delete Address
router.delete('/:user/single/:addressid', auth() ,addressController.deleteAddress)

router.get('/demo/resources' ,(req, res) => {
	res.send(Countries.map(cont => cont.cities.map(({ areas, name }) => { return { name , areas }})))
})






module.exports = router 
