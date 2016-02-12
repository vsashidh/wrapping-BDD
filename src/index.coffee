browser = require('./browser.js')
tc = require('./tcdriver.js')
testtoolfactory = require('./testtoolfactory.js')

OleTestToolDriver = () ->
    # create an instance of the test tool factory which assists with returning the correct test tool driver object
	TestToolFactory = new testtoolfactory

	self = {
		# @param cb: a callback function that takes a browserinstance param to be set by this function 
		launch: launch = (cb) -> 
			args = {}
			process.argv.forEach (val, index, array) ->
				re = /(\w*)=(\w*)/
				matches = re.exec val
				matches?.forEach (item,index, matches) ->
					if index % 2 != 0
						args[item] = matches[index+1]
					return
				return
			if not args.envName?
				args.envName = process.env.envName
				if not args.envName?
					throw new TypeError 'Invalid environment parameter or value. Fix: set envName=DEV'
			if not args.testBrowser? 
				args.testBrowser = process.env.testBrowser
				if args.testBrowser?
					browser.launchme args.envName, args.testBrowser, (proc) ->
						browserinstance = proc
						debugger
						cb browserinstance
						return
				else
					cb null 
			
			return

		# @param paramObj: an object containing information relevant to projectSuite, project, and fullmethodname
		# @param cb: a call back function that takes a boolean param to indicate the result of the call
		call: call = (paramObj,cb) ->

			testToolObj = TestToolFactory.createObject paramObj

			# listen to the testResult event to determine if test application has completed processing
			testToolObj.on 'testResult', () ->
				testToolObj.testresult cb
				return
			return 

		# @param browser: a browserinstance process that needs to be closed 	
		close: close = (browser) ->
			debugger;
			browser.stop()
			return
	}
	
	self

module.exports = OleTestToolDriver
