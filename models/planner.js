var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var passport = require('passport');
var passportLocal = require('passport-local');

// ??? need to require index.js from models, to use `db.checklist' etc

module.exports = function(sequelize, DataTypes) {
	var Planner = sequelize.define('planner', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				len: [6, 30],
			}
		},
		password: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		}
	}, 

	{
		classMethods: {
			// association with checklist
			associate: function(db){
				Planner.hasMany(db.checklist);
			},
			// encrypt pass
			encryptPass: function(password) {
				var hash = bcrypt.hashSync(password, salt)
				return hash; 
			},
			// compare pass
			comparePass: function(userpass, dbpass) {
				return bcrypt.compareSync(userpass, dbpass);
			},
			// create new user
			createNewUser: function(username, password, err, success){
				if(password.length < 6) {
					err({message: "Password must be more than 6 characters."})
				} else {
					Planner.create({
						username: username, 
						password: Planner.encryptPass(password)
					}).error(function(error){
						console.log(error)
						if(error.username) {
							err({message: "Your username must be at least 6 characters."})
						} else {
							err({message: "Your username already exists"}) // how does this part know if username exists??
						}
					}).success(function(planner) {
						success({message: "Your Account was created! Please log in."})
					});
				}
			} // close brackets for createNewUser
			// ,
			// // authorize - ** replaced with passport for additional authentication
			// authorize: function(username, password, err, success) {
			// 	Planner.find({
			// 		where: {
			// 			username: username
			// 		}
			// 	}) // when done searching
			// 	.done(function(error, user) {
			// 		if(error) {
			// 			console.log(error);
			// 			err({message: "Oops, something went wrong"});
			// 		}
			// 		else if (user === null){
			// 			err({message: "Username does not exist"});
			// 		}
			// 		else if ((Planner.comparePass(password, user.password)) === true) {
			// 			success();
			// 		}
			// 		else {
			// 			err({message: "Invalid Password"});
			// 		};
			// 	});
			// }  // close authorize function 

		} // close classMethods inner
	} // close classMethods outer

	); // close define planner argument


	// authentication - serialize/deserialize with passport
	passport.use(new passportLocal.Strategy({
		usernameField: 'username',
		passwordField: 'password', 
		passReqToCallback: true
	},
	function(req, username, password, done) {
		// find username in db, planner table 
		Planner.find({ 
			where: {
				username: username
			}
		})
		.done(function(error, user) { // to authorize with password check
			if(error) { // server or connection error
				console.log(error)
				return done(err, flash('loginMessage', 'Oops, something went wrong'))
			}
			if (user === null) { // check for username if exist
				return done(null, false, req.flash('loginMessage', 'Username does not exist'))
			}
			if ((Planner.comparePass(password, user.password)) !== true) { // check for password match
				return done(null, false, req.flash('loginMessage', 'Invalid Password'))
			}
			done(null, user); // when done, initiate passport to serialize/deserialize
		})
	}
	))


	return Planner; 

}; // close planner export function 

