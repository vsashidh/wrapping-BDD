# wrapping-BDD
This repository contains code which allows cucumber-js BDD framework to be wrapped around a testing tool by means of a custom driver.

# Install instructions
1. Download and install nodejs
2. Run : `npm install -g yo generator-wrap-bdd cucumber`
3. Create a local folder for storing the necessary cucumber-js artifacts :  `mkdir bdd`
4. `cd bdd`
5. `yo wrap-bdd`

# Collaborator instructions
All source is written using coffee script. In the command prompt of root directory use the following to quickly compile all coffee script source:
  `coffee --compile --output lib/ src/`
  
To wrap cucumber-js BDD with any testing tool, a testtoolfactory.coffee is provided to return an appropriate instance of the test tool driver. When writing the test tool driver, the only two criteria are that the test driver expose <b>a testResult method</b> and test driver emit <b>a testResult event</b>. The testResult method accepts a callback function with a boolean parameter. The 'testResult' event should be emitted when the testing tool has finished and returned result. Following are sample blocks where you will need to make changes when introducing a new test driver:

#### testtoolfactory.coffee:
<pre><code>
createObject: (paramObj) ->
		switch process.env.oletesttool
			when 'TestComplete'
				new tc paramObj
			when 'TestExecute'
				new te paramObj
			else
				throw new TypeError 'Invalid/Unsupported Testing tool. Fix: set oletesttool=TestComplete'
</code></pre>

#### customdriver.coffee
<pre><code>
module.exports = class tcdriver extends EventEmitter
	constructor: (paramObj,tool) ->
    		# do something and maybe you want to emit the 'testResult' event here
	testresult: (cb)->	
		cb @result
		return
</code></pre>

# Test scripts
Still need to work on this.
