var driver = require('../../lib/index.js');
var xfs = require('fs');

function World() {

	this.testDriver = new driver();

	this.browser = null;

	this.call = function(projectsuite, project, fullfuncname, cb){
		var result;
		var	argsObj = {
				projectSuite : projectsuite,
				project : project,
				fullmethodname : fullfuncname,
		};

		this.testDriver.call(argsObj, function(value){
			console.log('result: ' + value);
			if (value)
				cb();
			else
				cb(new Error("Something went wrong!"));
		});
	};

}

module.exports = function() {
	this.World = World;
};