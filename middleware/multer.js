const multer = require('multer')
const path = require('path')

const generateFileName = (req, file)=>{
	return [
	    path.parse(file.originalname).name,
	    '-',
	    Date.now(),
	    path.extname(file.originalname)
	    ].join('') 
}
const storage = {

	design(options = {}) {
		const defaults = {
			destination: './storage/designs/',
			filename(req, file, cb) {        
				// null as first argument means no error
				cb(null, generateFileName(req, file) )
			},
		}
		return multer.diskStorage({ ...defaults, ...options })
	},
	product(options = {}) {
		const defaults = {
			destination: './storage/products/',
			filename(req, file, cb) {        
				// null as first argument means no error
				cb(null, generateFileName(req, file) )
			},
		}
		return multer.diskStorage({ ...defaults, ...options })
	},
	user(options = {}) {
		const defaults = {
			destination: './storage/avatar/',
			filename(req, file, cb) {        
				// null as first argument means no error
				cb(null, generateFileName(req, file) )
			},
		}
		return multer.diskStorage({ ...defaults, ...options })
	},
	background(options = {}) {
		const defaults = {
			destination: './storage/background/',
			filename(req, file, cb) {        
				// null as first argument means no error
				cb(null, generateFileName(req, file) )
			},
		}
		return multer.diskStorage({ ...defaults, ...options })
	}
}
const fileFilter = {
	design(req, file, cb){
		return(cb(true))
	},
	product(file, cb){
		// Allowed ext
		const filetypes = /jpeg|jpg|png|gif/
		// Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
		// Check mime
		const mimetype = filetypes.test(file.mimetype)

		if(mimetype && extname){
			return cb(null,true)
		} else {
			cb('Error: Images Only!')
		}
	},
	avatar(file, cb){
		// Allowed ext
		const filetypes = /jpeg|jpg|png|gif/
		// Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
		// Check mime
		const mimetype = filetypes.test(file.mimetype)

		if(mimetype && extname){
			return cb(null,true)
		} else {
			cb('Error: Images Only!')
		}
	},
	background(file, cb){
		// Allowed ext
		const filetypes = /jpeg|jpg|png|gif/
		// Check ext
		const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
		// Check mime
		const mimetype = filetypes.test(file.mimetype)

		if(mimetype && extname){
			return cb(null,true)
		} else {
			cb('Error: Images Only!')
		}
	}
}
exports.uploadDesign = (options = {}) => {
	const defaults = {
		storage: storage.design(options),
		dest: 'storage/designs/',
		limits: {
			fileSize: 10000000000000000000,
		}
	}
	return multer({ ...defaults ,...options })
}
exports.uploadProduct = (options = {}) => {
	const defaults = {
		storage: storage.product(options),
		dest: 'storage/products/',
		limits: {
			fileSize: 10000000000000000000,
		},
		fileFilter(req, file, cb){
			fileFilter.avatar(file, cb)
		}
	}
	return multer({ ...defaults ,...options })
}
exports.uploadAvatar = (options = {}) => {
	const defaults = {
		storage: storage.user(options),
		dest: 'storage/avatar/',
		limits: {
			fileSize: 10000000000000000000,
		},
		fileFilter(req, file, cb){
			fileFilter.avatar(file, cb)
		}
	}
	return multer({ ...defaults ,...options })
}

exports.uploadBackground = (options = {}) => {
	const defaults = {
		storage: storage.background(options),
		dest: 'storage/background/',
		limits: {
			fileSize: 10000000000000000000,
		},
		fileFilter(req, file, cb){
			fileFilter.avatar(file, cb)
		}
	}
	return multer({ ...defaults ,...options })
}
	

