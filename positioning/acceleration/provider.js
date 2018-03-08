const MotionRepository = require('./motion.repository');

exports.register = async (container) => {
    container.singleton('MotionRepository', async () => new MotionRepository(
        await container.make('database'),
        await container.make('request')
    ));
};

exports.boot = async (container) => {

};
