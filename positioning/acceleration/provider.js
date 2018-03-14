const MotionRepository = require('./motion.repository');

exports.register = async (container) => {
    container.singleton('motion.repository', async () => new MotionRepository(
        await container.make('database'),
        await container.make('request')
    ));
};

exports.boot = async (container) => {

};
