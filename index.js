const express = require('express')
const config = require('./config')

const app = express()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()

const server = app.listen(config.port, () => console.log(`Listening on port ${config.port}...`))


module.exports = server