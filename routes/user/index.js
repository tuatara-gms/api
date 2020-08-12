const auth = require('../../middleware/auth')
const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user')


// All Users
router.get('/', auth() ,userController.getAll)

// Search Users
router.get('/search', auth() ,userController.search)

// Who am i
router.get('/self', auth(), userController.me)

// Register
router.post('/', userController.register)

// Register Admin

router.post('/admin', auth('admin') ,userController.registerAdmin)

// Get One User

router.get('/:id', auth() ,userController.getOne)

// Update User

router.put('/:id' , auth() ,userController.update)

// Put Self

router.put('/self/edit' , auth() ,userController.updateSelf)

// Get By Email
router.get('/email', userController.getByEmail)

// Email Available
router.get('/email/available', userController.emailAvailable)

// Add Avatar
router.put('/:id/avatar', userController.addAvatar)

// Remove Avatar
router.delete('/:id/avatar', userController.removeAvatar)

// Get Avatar
router.get('/:id/avatar', userController.getAvatar)

module.exports = router 
