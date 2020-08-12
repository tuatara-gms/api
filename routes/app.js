const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const appController = require('../controllers/app')

// Get
router.get('/' ,appController.getApp)

// Register
router.post('/', auth('admin') ,appController.register)

// Update
router.put('/' , auth('admin') ,appController.update)

// Add Background
router.put('/background' , auth('admin') ,appController.addBackground)

// Get Background
router.get('/background' ,appController.getBackground)

// Delete Background
router.delete('/background' , auth('admin'),appController.removeBackground)

module.exports = router 
