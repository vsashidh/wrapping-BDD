exec = require('child_process').exec
readline = require('readline')
stream = require('stream')
EventEmitter = require('events')
# testtoolFactory = require('./testtoolfactory.js')

module.exports = class tcdriver extends EventEmitter
	constructor: (paramObj,tool) ->
#		if tcdriver.caller != testtoolFactory.createObject
#			throw new Error "Should not be creating a new instance of the test tool. Usage: TestToolFactory.createObject (Args)"
		@projectSuite = paramObj.projectSuite
		@project = paramObj.project
		@fullmethodname = paramObj.fullmethodname
		if tool? then @testtool = tool else @testtool = 'TestComplete'

#		Uncomment the following and compile using coffescript to debug any child process related issues.
#		console.log 'cscript ' + getParent(__dirname) + '\\Utilities\\atr.js '+ @testtool + ' "' + @projectSuite + '" /p:"' + @project + '" /s:"' + @fullmethodname + '" /silentmode'

		atr = exec 'cscript ' + getParent(__dirname) + '\\Utilities\\atr.js '+ @testtool + ' "' + @projectSuite + '" /p:"' + @project + '" /s:"' + @fullmethodname + '" /silentmode',(error,stdoutBuffer,stderrBuffer) =>
			bufStream = new stream.PassThrough
			bufStream.end stdoutBuffer
			rl = readline.createInterface {input: bufStream}
			rl.on 'line', (msg) =>
				try
					jsonObj = JSON.parse msg.toString()
					jsonVal = jsonObj.TestResult
					if jsonObj.TestResult?
						debugger 
						if jsonObj.TestResult == 'Pass' then @result = true else @result = false

						#emit the testResult to broadcast the arrivals of the results
						@emit 'testResult'
					return
				catch e
					return
			if error?
				console.log "exec error: " + error
			return
#		console.log 'The child process started with ' + atr.pid	
		atr.on 'close', (code) =>
#			console.log "child process exited with code " + code
			return
		atr.on 'error', (err) =>
			console.log "Failed to start child process."
		 
	testresult: (cb)->	
		cb @result
		return

	getParent = (path) ->
		parentId = path.lastIndexOf "\\"
		path.substring 0,parentId
