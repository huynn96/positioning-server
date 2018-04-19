exports.up = async database => {
    return await database.schema.table('motion', table => {
        table.integer('exactly_direction');
        table.double('exactly_offset');
    });
};

exports.down = async database => {
    return await database.schema.table('motion', table => {
        table.dropColumn('exactly_direction');
        table.dropColumn('exactly_offset');
    });
};
