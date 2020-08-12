const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const moveController = require('../controllers/move')

// Get
router.get('/' ,moveController.getAll)

// Get One
router.get('/:id' , auth('stocks') ,moveController.getOne)

// Register
router.post('/', auth('stocks') ,moveController.add)

// Update
router.put('/:id' , auth('stocks') ,moveController.update)

// Delete
router.delete('/:id' , auth('stocks'),moveController.deleteMove)

module.exports = router 
