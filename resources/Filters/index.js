const TrimExtraZeros = num => (num % 1 === 0 ? parseInt(num, 10) : num)
module.exports = {
	ToUpperCase(val) {
		return val.toUpperCase()
	},
	ToLowerCase(val) {
		return val.toLowerCase()
	},
	CapitalizeName(val) {
		if (!typeof val === 'string' || !val.length) {
			return val
		}
		// Split over spaced
		let splitted = val.split(' ')
		let i
		for (i = 0; i < splitted.length; i += 1) {
			splitted[i] = `${splitted[i].charAt(0).toUpperCase()}${splitted[i].slice(
				1
			)}`
		}
		splitted = splitted.join(' ')
		splitted = splitted.split('-')
		for (i = 0; i < splitted.length; i += 1) {
			splitted[i] = `${splitted[i].charAt(0).toUpperCase()}${splitted[i].slice(
				1
			)}`
		}
		return splitted.join('-')
	},
	CapitalizeFirst(val) {
		if (!typeof val === 'string' || !val.length) {
			return val
		}
		return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
	},
	TrimExtraZeros(num) {
		return TrimExtraZeros(num)
	},
	ToFixedTwo(num) {
		return parseFloat(num, 10).toFixed(2)
	},
	ToFixedOne(num) {
		return parseFloat(num, 10).toFixed(1)
	},
	MigaNumber(num) {
		if (parseFloat(num, 10) != num)
			return num
		if (num / 10000000 > 1) {
			return `${TrimExtraZeros((num / 10000000).toFixed(2))}M`
		}
		if (num / 1000 > 1) {
			return `${TrimExtraZeros((num / 1000).toFixed(1))}K`
		}
		return num
	}
}
