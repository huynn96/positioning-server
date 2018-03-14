const io = require('socket.io');
const Socket = require('./socket');
const MotionSocket = require('./motion-socket');

exports.register = async (container) => {
    container.singleton('socket.io', async () => new Socket(io));
    container.singleton('motion.socket', async () => new MotionSocket(
        await container.make('socket.io'),
        await container.make('motion.repository')
    ));
};

exports.boot = async (container) => {

};
