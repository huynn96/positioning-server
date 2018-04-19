exports.up = async database => {
    return await database.schema.alterTable('motion', table => {
        table.double('offset').alter();
    });
};

exports.down = async database => {
    return await database.schema.alterTable('motion', table => {
        table.integer('offset').alter();
    });
};
