exports.up = async database => {
	return await database.schema.createTableIfNotExists('fingerprinter_info', table => {
		table.charset('utf8');
		table.increments('id');
		table.integer('reference_point_id');
		table.integer('ap_name');
		table.integer('mac_address');
		table.integer('rss');
	});
};

exports.down = async database => {
	return await database.schema.dropTableIfExists('fingerprinter_info');
};
