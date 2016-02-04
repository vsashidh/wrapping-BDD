tc = require('./tcdriver.js')
te = require('./tedriver.js')

module.exports = class TestToolFactory
#	constructor: () ->
#		return

	createObject: (paramObj) ->
		switch process.env.oletesttool
			when 'TestComplete'
				new tc paramObj
			when 'TestExecute'
				new te paramObj
			else
				throw new TypeError 'Invalid/Unsupported Testing tool. Fix: set oletesttool=TestComplete'
