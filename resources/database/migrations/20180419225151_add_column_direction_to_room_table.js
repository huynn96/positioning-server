exports.up = async database => {
    return await database.schema.table('room', table => {
        table.string('direction');
    });
};

exports.down = async database => {
    return await database.schema.table('room', table => {
        table.dropColumn('direction');
    });
};
