module.exports = async function (context, next) {
    let reqData = context.request.body;
    context.positionInfo = {
        roomId: reqData.roomId,
        transactionId: reqData.extendGetLocationModel.transactionId
    };
    /** @namespace reqData.infos */
    context.wifiInfos = reqData.infos.map(wifiInfo => {
        return {
            apName    : wifiInfo.name,
            macAddress: wifiInfo.macAddress,
            rss       : wifiInfo.rss
        }
    });
    context.motionInfo = {
        roomId: reqData.roomId,
        x1: reqData.extendGetLocationModel.x,
        y1: reqData.extendGetLocationModel.y,
        direction: reqData.direction,
        offset: reqData.offset,
        stepCount: reqData.stepCount
    };
    await next();
};
