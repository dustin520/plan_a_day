
# DayPlan

## Plan-a-Day App

## Wk 5 - Project 1

### Purpose
An app to plan out `what you want to do` or `where you want to eat` based on a `location`.

### Features
* create user account to make and save lists
* search by location to display top 10 results of places to eat and things to do
* add items to your personal checklist

### MVP
* 2 Models with association - CHECK
* partials and views - IN PROGRESS
* handle invalid data for incorrect input, display error messages, validate sign up -CHECK
* secure passwords - CHECK
* external APIs
* Heroku Deployment
* Authentication and Authorization - CHECK 
* Testing - request specs that verify pages return 200 response and model specs that verify validations 

### Complete
* validate input for user length, password length, duplicate user with messages upon sign up
* secure passwords - hash/salt, saved in db
* authentication/authorization 

### In Progress
* figure out api restictions, etc 
* set up reamining routes
* if no search and press enter, alert user
* if no search, but click results, make sure results redirects to search/home
* search without account
* request specs and server test 
* fix home page, after post working 


### Issues
* flash messages not working - messages worked with authorize, not after implementing passportLocal - FIXED
	fix = <% if(typeof message !== 'undefined') { %>
* fix security issue with viewing others pages 

### Questions
* Below -
1. 
	res.render('app/home', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user // ?? user or planner ?? why user? 
	}); 
2. supposed to be `loginMessage`? or just {message} ??
	return done(err, flash('loginMessage', 'Oops, something went wrong'))
	- fixed with
	 message: req.flash('loginMessage') 

### Additional
* category column for checklist
* notes column for checklist
* map interface
* option to add multiple items to list before routing,  or redirect immediately 
* delete and update checklist 
* log in immediately with sign up
* search on each page, so can use app without loggin in, but can't save



