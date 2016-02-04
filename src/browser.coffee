launcher = require('browser-launcher2')
environment = require('./environment.js')

exports.launchme = (env,testbrowser,cb) ->
	debugger

	launcher getUserHome() + "\\.config\\browser-launcher2\\config.json",(err,launch) ->
		debugger
		if err then throw err
		debugger
		# the URL to visit which is derived from the environment file
		environment.url env,(url)-> 
			uri = url
#				console.dir 'Url retrieved was : ' + uri
		
			# the options 
			options =
				browser: testbrowser
				
			# launch callback function	
			launch uri, options, (err,instance) ->
				if err then throw err
#				console.log 'Instance started with PID:',instance.pid
				cb(instance)
				return
			return
		return
	return


getUserHome = () ->
	return process.env[ if (process.platform == 'win32') then 'USERPROFILE' else 'HOME']