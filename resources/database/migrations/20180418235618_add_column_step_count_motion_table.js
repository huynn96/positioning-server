exports.up = async database => {
    return await database.schema.table('motion', table => {
        table.string('step_count');
    });
};

exports.down = async database => {
    return await database.schema.table('motion', table => {
        table.dropColumn('step_count');
    });
};
