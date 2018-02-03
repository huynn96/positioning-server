module.exports = async function (context, next) {
	let reqData = context.request.body;
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
