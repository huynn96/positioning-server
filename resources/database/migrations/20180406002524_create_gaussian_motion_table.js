exports.up = async database => {
    return await database.schema.createTableIfNotExists('gaussian_motion', table => {
        table.charset('utf8');
        table.increments('id');
        table.integer('reference_point_start_id');
        table.integer('reference_point_finish_id');
        table.double('mean_direction');
        table.double('variance_direction');
        table.double('mean_offset');
        table.double('variance_offset');
    });
};

exports.down = async database => {
    return await database.schema.dropTableIfExists('gaussian_motion');
};
