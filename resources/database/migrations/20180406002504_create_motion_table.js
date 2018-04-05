exports.up = async database => {
    return await database.schema.createTableIfNotExists('motion', table => {
        table.charset('utf8');
        table.increments('id');
        table.integer('reference_point_start_id');
        table.integer('reference_point_finish_id');
        table.integer('direction');
        table.integer('offset');
    });
};

exports.down = async database => {
    return await database.schema.dropTableIfExists('motion');
};
