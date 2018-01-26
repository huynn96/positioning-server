exports.up = async database => {
	return await database.schema.createTableIfNotExists('reference_point_info', table => {
		table.charset('utf8');
		table.increments('id');
		table.integer('x');
		table.integer('y');
		table.integer('room_id');
	});
};

exports.down = async database => {
	return await database.schema.dropTableIfExists('reference_point_info');
};
