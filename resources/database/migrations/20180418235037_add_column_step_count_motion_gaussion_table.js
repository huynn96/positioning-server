exports.up = async database => {
    return await database.schema.table('gaussian_motion', table => {
        table.string('step_count');
    });
};

exports.down = async database => {
    return await database.schema.table('gaussian_motion', table => {
        table.dropColumn('step_count');
    });
};
