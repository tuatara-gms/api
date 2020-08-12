const Countries = require('../resources/countries')
const _ = require('lodash')

module.exports = {
	async getCountries(req,res) {
		return res.send(Countries.map( country => _.omit(country, ['cities'])))
	},
	async getCities(req, res) {
		if (!req.params || !req.params.country) {
			return res.status(400).send('Country is required')
		}

		const selectedCountry = Countries.filter(c => c._id === req.params.country)

		if (!selectedCountry.length) {
			return res.status(400).send('Country does not exist')
		}

		return res.send(selectedCountry[0].cities)

	}
}