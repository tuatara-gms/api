const defaults = require('./default')
const envConfig = require(`./${process.env.NODE_ENV || 'development'}`)
const config = {
    ...defaults,
    ...envConfig
}
module.exports = config