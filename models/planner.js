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
			ecryptPass: function(password) {
				var hash = bcrypt.hashSync(password, salt)
				return hash; 
			},
			// compare pass
			comparePass: function(userpass, dbpass) {
				return bcrypt.compareSync(userpass, dbpass);
			}
			// create new user
			// authorize and authenticate
		

		} // close classMethods inner
	} // close classMethods outer

	); // close define planner argument
	return Planner; 

}; // close planner export function 