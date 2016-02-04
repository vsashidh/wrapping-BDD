fs = require 'fs'
xml2js = require 'xml2js'

exports.url = (env = 'DEV',callback)-> 
	parser = new xml2js.Parser
#   reading asynchronously	
	fs.readFile '.\\Utilities\\envs.xml', (err,data) ->
		if err then throw err
		parser.parseString data, (err,result) ->
			if err then throw err
			xmlnode = result.Settings[env]
			url = xmlnode?[0].$.URL
#			console.dir 'The result is : ' + url
			if url then callback(url) else throw new TypeError 'Invalid environment parameter or value. Usage: envName=DEV'
			return
		return

#	reading synchronously
#	xml = fs.readFileSync '..\\..\\Web\\FMI-PathologyPortal-Project\\cheetah.xml'
#	parser.parseString xml, (err,result) ->
#		if err then throw err
#		debugger
#		console.dir 'The result is : ' + result.Settings.DEV[0].$.URL
#		debugger
#		result.Settings.DEV[0].$.URL

	return