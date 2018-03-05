const Acceleration = require('positioning/acceleration/acceleration');
const moment = require('moment');

module.exports = async function (context, next) {
    let reqData = context.request.body;
    
    context.motionInfos = reqData["accelerations"].map((acceleration) => {
        return new Acceleration(
            acceleration.x,
            acceleration.y,
            acceleration.z,
            reqData["typeActivity"],
            moment(acceleration.timestamp).toDate()
        );
    });
    await next();
};
