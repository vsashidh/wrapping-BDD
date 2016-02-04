var BeforeHooks = function () {
	this.Before(function (scenario,cb) {
		// before scenario tasks goes here:
		this.testDriver.launch( (launchedbrowser) => {
			debugger;
			this.browser = launchedbrowser;
			cb();
     	});

	});
};

module.exports = BeforeHooks;