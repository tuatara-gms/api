// const mongoose = require('mongoose')
// const config = require('../config')

// module.exports = function() {
// 	const db = config.db
// 	 mongoose.set('useUnifiedTopology', true)
// 	mongoose.set('useNewUrlParser', true)
// 	mongoose.set('useCreateIndex', true)
// 	mongoose.set('useFindAndModify', false)
// 	mongoose.set('reconnectTries: 30,
//             mongoose.set('reconnectInterval: 500, // in ms
// 	mongoose.connect(db)
// 		.then(() => console.log(`Connected to ${db}...`))
// }

const mongoose = require('mongoose')
const config = require('../config')

module.exports = function() {
	const db = config.db
	mongoose.connect(db, { useNewUrlParser: true })
		.then(() => console.log(`Connected to ${db}...`))
}
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)