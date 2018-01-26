exports.up = async database => {
	return await database.schema.createTableIfNotExists('room', table => {
		table.charset('utf8');
		table.increments('id');
		table.string('room_name');
		table.string('address');
	});
};

exports.down = async database => {
	return await database.schema.dropTableIfExists('room');
};
