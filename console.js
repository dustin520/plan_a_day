// for testing and console logging purposes 

var repl = require('repl'),
	db = require('./models/index.js'),
	pkge = require('./package'),
	newREPL = repl.start(pkge.name + " > ");






	newREPL.context.db = db; 