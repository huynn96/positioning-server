const Acceleration = require('positioning/acceleration/acceleration');

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
                let motionInfos = data['accelerations'].map((acceleration) => {
                    return new Acceleration(
                        acceleration.x,
                        acceleration.y,
                        acceleration.z,
                        acceleration.timestamp
                    );
                });
                let result = await motionRepos.addMotionInfo(motionInfos);
                socket.emit('localization', {
                    type   : 'success',
                    message: 'localization successfully!',
                    result: result.result,
                    lastTime: parseInt(result.lastTime)
                });
            });
        });
    }
}

module.exports = MotionSocket;
