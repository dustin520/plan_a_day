var express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	request = require('request'),
	db = require('./models/index'),
	app = express();

// set up for: 1. views to be read as ejs, 2. forms to be parsed, 3. access to public folder for styling;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); // what is `extended: true`
app.use(express.static(__dirname + 'public'));

// more middleware config - for authorization/authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // for flash err messages 

// cookie session set up
app.use(cookieSession({
	secret: 'secretkey',
	name: 'cookie created by me',
	maxage: 360000 // 6 min logout timer 
}));

// site/index landing page
app.get("/", function(req, res) {
	res.render('site/index');
});





// 404 page *** make sure at bottom ***
app.get('*', function(req, res) {
	res.render("site/404");
});

app.listen(3000, function() {
	console.log("let\'s get this party started - port 3000");
});

