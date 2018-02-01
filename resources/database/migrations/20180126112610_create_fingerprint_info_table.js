exports.up = async database => {
	return await database.schema.createTableIfNotExists('fingerprint_info', table => {
		table.charset('utf8');
		table.increments('id');
		table.integer('reference_point_id');
		table.string('ap_name');
		table.string('mac_address');
		table.integer('rss');
	});
};

exports.down = async database => {
	return await database.schema.dropTableIfExists('fingerprint_info');
};
