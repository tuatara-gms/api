const path = require('path')
const mime = require('mime-types')
const fs = require('fs')
const {Deskaf, validate} = require('../models/app')
const { Stock } = require('../models/stock')
const { uploadBackground } = require('../middleware/multer')


const generateFileName = (req, file, data) => {
	return [
		path.parse(file.originalname).name,
		'-',
		data,
		path.extname(file.originalname)
	].join('')
}

const getFilePath = name => path.resolve(`storage/background/${name}`)

module.exports = {
	// Get
	async getApp(req, res) {
		const appSpecs = await Deskaf.find({})
		if (appSpecs && appSpecs.length) {
			return res.send(appSpecs[0])
		} else {
			// return res.status(404).send('No App Configurations Found.')
			const deskaf = new Deskaf(req.body)
			await deskaf.save()
			return res.send(deskaf)
		}
	},
	// Add Client Deskaf
	async register(req, res) {
		const { error } = validate(req.body) 
		if (error) return res.status(400).send(error.details[0].message)
		const appSpecs = await Deskaf.find({})
		if (appSpecs && appSpecs.length) return res.status(400).send('You Cant Add Multiple Configurations.')
		deskaf = new Deskaf(req.body)
		await deskaf.save()
		return res.send(deskaf)
	},
	// Update deskaf

	async update(req, res) {
		const { error } = validate(req.body, true) 
		if (error) return res.status(400).send(error.details[0].message)
		const deskaf = await Deskaf.update(
			{ },
			{$set: req.body},
			{ multi: true , new : true }
		)
	    const appSpecs = await Deskaf.find({})
	    if (req.body.promotions && req.body.promotions) {
	    	let i
	    	let temp
	    	for (i = 0; i < req.body.promotions.length; i += 1) {
	    		temp = await Stock.find({ name: `Promotion: ${req.body.promotions[i].name}`, category: 'Automated Promotion' })
	    		if (!temp.length) {
	    			const newPromotion = new Stock({
	    				name: `Promotion: ${req.body.promotions[i].name}`,
	    				category: 'Automated Promotion',
	    				import_price: req.body.promotions[i].amount,
	    				price: 0,
	    				notes: req.body.promotions[i].type,
	    				external: true,
	    				hidden: true
	    			})
	    			await newPromotion.save()
	    		}
	    	}
	    }
		if (!appSpecs || !appSpecs.length) return res.status(404).send('Deskaf Not Found.')
		res.send(appSpecs[0])
	},

	async addBackground(req, res) {

		const appSpecs = await Deskaf.find({})
		if (appSpecs && !appSpecs.length) {
			return res.status(404).send('App Instance Not Found')
		}
		// Remove The Old Background
		if(appSpecs.background) {
			fs.unlink(getFilePath(appSpecs[0].background), err => {
				if (err) {
					return res.status(500).send('Something Went Wrong')
				}
			})
		}
		const filename = (req, file, cb) => {
			cb(null, generateFileName(req, file ,'designkaf'))
		}
		uploadBackground({filename}).single('avatar')(req, res, async error => {
			if (error) {
				return res.status(500).send('Something Went Wrong')
			}
			if (!req.file) {
				return res.status(400).send('No Files Selected')
			}
			const background = generateFileName(req, req.file, 'designkaf')
			const updated = await Deskaf.findOneAndUpdate(
				{ _id: appSpecs[0]._id },
				{
					$set: { background }
				},
				{
					new: true
				}
			)
			return res.send(updated)
		})
	},

	// Remove Background

	async removeBackground(req, res) {

		const appSpecs = await Deskaf.find({})
		if (appSpecs && !appSpecs.length) {
			return res.status(404).send('App Instance Not Found')
		}
		// Remove The Old Avatar
		if(appSpecs[0].background) {
			fs.unlink(getFilePath(appSpecs[0].background), err => {
				if (err) {
					return res.status(500).send('Something Went Wrong')
				}
			})
		} else {
			return res.status(404).send('No Avatar Found')
		}
		const updated = await Deskaf.update(
			req.params.id,
			{
				$set: { background: null }
			},
			{
				new: true
			}
		)
		return res.send(updated[0])
	},

	async getBackground(req, res) {
		const appSpecs = await Deskaf.find({})
		if (appSpecs && !appSpecs.length) {
			return res.status(404).send('App Instance Not Found')
		}

		if(appSpecs[0].background) {
			fs.access(getFilePath(appSpecs[0].background), fs.F_OK, (err) => {
				if (err) {
					return res.status(404).send('File Not Exist')
				}
				return res.set({
					'Content-Type': mime.lookup(path.extname(appSpecs[0].background)),
					'Content-Disposition': `inline; filename="designkaf${path.extname(appSpecs[0].background)}"`
				}).sendFile(getFilePath(appSpecs[0].background))
			//file exists
			})			
		} else {
			return res.status(404).send('Background Not Found')
		}
	}

}
