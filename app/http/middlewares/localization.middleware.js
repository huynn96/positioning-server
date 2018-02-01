module.exports = async function (context, next) {
	let reqData      = context.request.body;
	context.positionInfo = reqData.positionInfo;
	context.wifiInfos = reqData.wifiInfos.map(wifiInfo => {
		return {
			macAddress: wifiInfo.mac_address,
			rss        : wifiInfo.rss
		}
	});
	
	await next();
};
