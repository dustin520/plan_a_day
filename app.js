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
	secret: "hello",
	name: 'cookie created by me',
	maxage: 1440000 // 24 min logout timer 
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

// *** req Yelp API access setup ***
var yelp = require("yelp").createClient({ 
	consumer_key: process.env.YELP_KEY,
	consumer_secret: process.env.YELP_SECRET,
	token: process.env.YELP_TOKEN,
	token_secret: process.env.YELP_TOKEN_SECRET
});

// *** GETS ***

// landing page
app.get("/", function(req, res) {
	if (!req.user) { // ??? when was req.user defined ??? 
		res.render('site/index', {message: null});
	} else {
		res.redirect('/home'); 
	}
});

// login page
app.get("/login", function(req, res) {
	if (!req.user) {
		res.render('site/login', {message: req.flash('loginMessage'), username: ""});
	} else {
		res.redirect('home');
	}
});

// signup page
app.get("/signup", function(req, res) {
	if (!req.user) {
		res.render('site/signup', {message: req.flash('loginMessage'), username: ""});
	} else {
		res.redirect('home');
	}
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

// get search param from search.ejs to post on results.ejs 
app.get('/searchFor', function(req, res) {
	var queryCat = req.query.searchCat || "food";
	var queryCity = req.query.searchCity || "New York";
	var queryZip = req.query.searchZip || 91326; // string or number ???
	// console.log(req.query);
	yelp.search({term: queryCat, location: queryCity}, function(error, data) {
	  console.log(error);
	  console.log(data); 
	  var list = data.businesses; 
	  // res.send(data.businesses); // test
  	res.render('app/results', {searchList: list || [], 
  		isAuthenticated: req.isAuthenticated(),
  		user: req.user
  	}); 
	});
});

// // to search and display to index without login - *** FIX ***
// app.get('/searchIt', function(req, res) {
// 	var queryCat = req.query.searchCat || "activity";
// 	var queryCity = req.query.searchCity || "Chicago";
// 	// console.log(req.query);
// 	yelp.search({term: queryCat, location: queryCity}, function(error, data) {
// 	  console.log(error);
// 	  console.log(data); 
// 	  var list = data.businesses; 
// 	  // res.send(data.businesses); // test
//   	res.render('site/index', {searchList: list || []}); 
// 	});
// });

// app results page
app.get("/results", function(req, res) {
	res.render('app/results', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user 
	});
});

// app location by id 
app.get("/location/:id", function(req, res){
	var businessId = req.params.id;
	yelp.business(businessId, function(error, data) { // another way to do it without 2nd request??
		console.log(error);
		console.log(data);
		var detail = data;
		res.render('app/location.ejs', {detail: data || [], 
		isAuthenticated: req.isAuthenticated(),
  		user: req.user
		});
	});
});

// logout function - redirect to index
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect('/'); 
});

// *** POSTS ***

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


// post search results from API and < search.ejs to results.ejs


// add item(s) from results.ejs to checklist/home.ejs
app.post('/saveNow', function(req,res){
	var id = Number(req.body.planner); // working? how to fix?
	db.planner.find(id)
		.success(function(foundPlanner){
			console.log("The found planner", foundPlanner)
			console.log("place name", req.body.placeName)
			var checklist = db.checklist.create({
				plan: req.body.placeName,
				plannerId: foundPlanner.id
			}).success(function(){
				// res.redirect("/home") // temp fix, to add multiple w/o redirect, need another method
			});
		});
});

// add item from location.ejs, after clicking result to db - REFA
app.post('/save', function(req,res) {
	var id = Number(req.body.planner); // working? how to fix?
	db.planner.find(id)
		.success(function(foundPlanner){
			console.log("The found planner", foundPlanner)
			console.log("place name", req.body.placeName)
			var checklist = db.checklist.create({
				plan: req.body.placeName,
				plannerId: foundPlanner.id
			}).success(function(){
				res.redirect("/home")
			})
		});
});


// Saved checklist to Display on Planner's 'personal' Home page by retrieve db
app.get('/home/:id', function(req,res){
	var id = Number(req.params.id);
	db.planner.find(id)
		.success(function(savedList){
			db.checklist.findAll({
				where: {
					plannerId: id
				}
			})
		});
});


// *** PUTS/Update ***

// *** DELETES ***

// 404 page *** make sure at bottom ***
app.get('*', function(req, res) {
	res.render("site/404");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("let\'s get this party started - port 3000");
});

