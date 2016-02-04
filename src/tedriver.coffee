exec = require('child_process').exec
readline = require('readline')
stream = require('stream')
EventEmitter = require('events')
# testtoolFactory = require('./testtoolfactory.js')

module.exports = class tedriver extends EventEmitter
	constructor: (paramObj) ->
		super paramObj,'TestExecute'