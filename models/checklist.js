

function Checklist(sequelize, DataTypes) {

	var	Checklist = sequelize.define('checklist', {
		plan: DataTypes.STRING,
		category: DataTypes.STRING,
		link: DataTypes.TEXT, 
		plannerId: {
			type: DataTypes.INTEGER,
			foreignKey: true
		}
	},
	{
		classMethods: {
			associate: function(db) {
				Checklist.belongsTo(db.planner);
			}
		}
	})
	return Checklist; 

}; // close checklist brackets

module.exports = Checklist; 