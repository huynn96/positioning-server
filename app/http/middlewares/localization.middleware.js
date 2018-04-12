module.exports = async function (context, next) {
	let reqData = context.request.body;
    console.log(reqData);
    context.positionInfo = {
		roomId: reqData.roomId
	};
	/** @namespace reqData.infos */
	context.wifiInfos = reqData.infos.map(wifiInfo => {
		return {
			apName    : wifiInfo.name,
			macAddress: wifiInfo.macAddress,
			rss       : wifiInfo.rss
		}
	});
	
	await next();
};
