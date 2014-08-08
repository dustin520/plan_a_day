module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished

    migration.createTable('checklists', 
    {
    	id: {
    		type: DataTypes.INTEGER,
    		primaryKey: true,
    		autoIncrement: true
    	},
    	createdAt: DataTypes.DATE,
    	updatedAt: DataTypes.DATE,
    	plan: DataTypes.STRING,
        category: DataTypes.STRING,
        link: DataTypes.TEXT, 
    	plannerId: {
    		type: DataTypes.INTEGER,
    		foreignKey: true
    	}
    })
    .complete(done); 
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished

    migration.dropTable('checklists')
    .complete(done); 
  }
}
