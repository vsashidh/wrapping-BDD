var AfterHooks = function () {
	this.After(function (scenario) {

		// after scenario tasks goes here:
		debugger
		this.testDriver.close(this.browser);
		
	});
};

module.exports = AfterHooks;