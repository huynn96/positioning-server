module.exports = async function (context, next) {
    let reqData = context.request.body;
    // console.log(reqData);
    /** @namespace reqData.oldCandidates */
    context.positionInfo = {
        roomId       : reqData.roomId,
        transactionId: reqData.oldCandidates.length ? reqData.oldCandidates[0].transactionId : 0
    };
    /** @namespace reqData.infos */
    context.wifiInfos = reqData.infos.map(wifiInfo => {
        return {
            apName    : wifiInfo.name,
            macAddress: wifiInfo.macAddress,
            rss       : wifiInfo.rss
        }
    });
    context.motionInfo    = {
        roomId   : reqData.roomId,
        direction: reqData.direction,
        offset   : reqData.offset,
        stepCount: reqData.stepCount
    };
    context.oldCandidates = reqData.oldCandidates;
    await next();
};
