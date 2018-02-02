exports.up = async database => {
	return await database.schema.createTableIfNotExists('gaussian_fingerprint_info', table => {
		table.charset('utf8');
		table.increments('id');
		table.integer('reference_point_id');
		table.string('mac_address');
		table.string('ap_name');
		table.double('mean');
		table.double('variance');
	});
};

exports.down = async database => {
	return await database.schema.dropTableIfExists('gaussian_fingerprint_info');
};
