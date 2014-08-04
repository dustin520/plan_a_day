
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
* Authentication and Authorization - IN PROGRESS
* Testing - request specs that verify pages return 200 response and model specs that verify validations 

### Complete
* validate input for user length, password length, duplicate user with messages upon sign up
* secure passwords - hash/salt, saved in db

### In Progress
* figure out api 
* set up routes
* authentication 

### Issues
* flash messages not working - messages worked with authorize, not after implementing passportLocal 

### Questions
* Below -
1. 
	res.render('app/home', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user // ?? user or planner ?? why user? 
	}); 
2. supposed to be `loginMessage`? or just {message} ??
	return done(err, flash('loginMessage', 'Oops, something went wrong'))

### Additional
* category column for checklist
* notes column for checklist
* map interface
* option to add multiple items to list before routing,  or redirect immediately 
* delete and update checklist 
* log in immediately with sign up



