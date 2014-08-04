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


// *** SESSION PREP *** 

// cookie session set up
app.use(cookieSession({
	secret: 'secretkey',
	name: 'cookie created by me',
	maxage: 360000 // 6 min logout timer 
}));

// more middleware config - for authorization/authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // for flash err messages 

// prep serialize - to run when logging in
passport.serializeUser(function(user, done) {
	console.log('Serialize just ran');
	done(null, user.id); // user logs in, we verify user id and store in session 
});

// prep deserialize - verify user from page to page
passport.deserializeUser(function(id, done) {
	console.log('Deserialize just ran');
	db.planner.find({
		where: {
			id: id
		}
	}).done(function(error, user) {
		done(error, user);
	});
});


// *** GETS ***

// landing page
app.get("/", function(req, res) {
	res.render('site/index', {message: null});
});

// login page
app.get("/login", function(req, res) {
	res.render('site/login', {message: null, username: ""});
});

// signup page
app.get("/signup", function(req, res) {
	res.render('site/signup', {message: null, username: ""});
});

// app home page
app.get("/home", function(req, res) {
	res.render('app/home', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user // ?? user or planner ?? why user? 
	}); 
});

// app search page
app.get("/search", function(req, res) {
	res.render('app/search', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user 
	});
});

// app results page
app.get("/results", function(req, res) {
	res.render('app/results', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user 
	});
});

// app location page
app.get("/location", function(req, res) {
	res.render('app/location', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user 
	});
});

// logout function - redirect to index
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect('/'); 
});

// *** POSTS ***

// sign up new user < signup.ejs
app.post("/create", function(req, res) {
	db.planner.createNewUser(req.body.username, req.body.password,
		function(err) {
			res.render('site/signup', {message: err.message, username: req.body.username});
		},
		function(success) {
			res.render('site/index', {message: success.message}); 
		});
});

// login feature with passport for serialization/deserialize - authenticate && authorize 
app.post('/login', passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
}));

// // log in user < login.ejs  *** login feature through `authorize` *** replaced with passport 
// app.post("/login", function(req, res) {
// 	db.planner.authorize(req.body.username, req.body.password,
// 		function(err){
// 			res.render('site/login', {message: err.message, username: req.body.username});
// 		},
// 		function(success){
// 			res.redirect('home');
// 		});
// });


// post search results from API and < search.ejs to results.ejs
// add item(s) from results.ejs to checklist/home.ejs

// *** PUTS/Update ***

// *** DELETES ***

// 404 page *** make sure at bottom ***
app.get('*', function(req, res) {
	res.render("site/404");
});

app.listen(3000, function() {
	console.log("let\'s get this party started - port 3000");
});

