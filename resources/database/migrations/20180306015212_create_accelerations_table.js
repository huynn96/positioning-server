exports.up = async database => {
    return await database.schema.createTableIfNotExists('accelerations', table => {
        table.charset('utf8');
        table.increments('id');
        table.float('x');
        table.float('y');
        table.float('z');
        table.integer('label');
        table.specificType('created_at', 'DATETIME(3)');
    });
};

exports.down = async database => {
    return await database.schema.dropTableIfExists('accelerations');
};
