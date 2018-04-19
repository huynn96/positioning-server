exports.up = async database => {
    return await database.schema.table('gaussian_motion', table => {
        table.dropColumn('reference_point_start_id');
        table.dropColumn('reference_point_finish_id');
    });
};

exports.down = async database => {
    return await database.schema.table('gaussian_motion', table => {
        table.integer('reference_point_start_id');
        table.integer('reference_point_finish_id');
    });
};
