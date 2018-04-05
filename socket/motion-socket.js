const Acceleration = require('positioning/acceleration/acceleration');
const Direction = require('positioning/acceleration/direction');

class MotionSocket {
    constructor(socket, motionRepos) {
        this.socket      = socket;
        this.motionRepos = motionRepos;
    }
    
    listen() {
        let motionRepos = this.motionRepos;
        this.socket.io.on('connection', function (socket) {
            console.log('A device has connect to socket');
            socket.on('localization', async function (data) {
                data = JSON.parse(data);
                let accelerations = data['accelerations'].map((acceleration) => {
                    return new Acceleration(
                        acceleration.x,
                        acceleration.y,
                        acceleration.z,
                        acceleration.timestamp
                    );
                });
                let directions = data['directions'].map((direction) => {
                    return new Direction(
                        direction.direction,
                        direction.pitch,
                        direction.roll,
                        direction.timestamp,
                    );
                });
                let result = await motionRepos.addMotionInfo({accelerations: accelerations, directions: directions});
                socket.emit('localization', {
                    type   : 'success',
                    message: 'localization successfully!',
                    offset: result[0],
                    direction: result[1]
                });
            });
        });
    }
}
module.exports = MotionSocket;
