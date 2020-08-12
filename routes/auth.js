const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.post('/', authController.post)

// Google Auth
router.post('/google', authController.googleAuth)

router.post('/facebook', authController.facebookAuth)


module.exports = router 
