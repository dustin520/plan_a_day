// for testing and console logging purposes 

var repl = require('repl'),
	db = require('./models/index.js'),
	pkge = require('./package'),
	newREPL = repl.start(pkge.name + " > ");
var yelp = require('yelp'); 


// *** req Yelp API access setup ***
var yelp = require("yelp").createClient({ 
	consumer_key: process.env.YELP_KEY,
	consumer_secret: process.env.YELP_SECRET,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
});



// // See http://www.yelp.com/developers/documentation/v2/search_api
// yelp.search({term: "food", location: "Montreal"}, function(error, data) {
//   console.log(error);
//   console.log(data);
// });

var newREPL = repl.start('food > ')
newREPL.context.yelp = yelp; 


	newREPL.context.db = db; 