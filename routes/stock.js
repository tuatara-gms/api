const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stock')

// Get
router.get('/' ,stockController.getAll)

// Get One
router.get('/:id' , auth('stocks') ,stockController.getOne)

// Register
router.post('/', auth('stocks') ,stockController.add)

// Stock Move
router.post('/:id/move', auth('stocks') ,stockController.stockMove)

// Update
router.put('/:id' , auth('stocks') ,stockController.update)

// Delete
router.delete('/:id' , auth('stocks'),stockController.deleteStock)

module.exports = router 
