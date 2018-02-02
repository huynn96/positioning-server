module.exports = async function (context, next) {
	let data = context.request.body;
	/** @namespace data.itemPostReferencePointGaussRequests.listRss */
	context.positionInfo = {
		roomId: data.roomId,
		x     : data.x,
		y     : data.y
	};
	/** @namespace data.itemPostReferencePointGaussRequests */
	context.wifiInfos = data.itemPostReferencePointGaussRequests.map(wifiInfo => {
		return {
			macAddress: wifiInfo.macAddress,
			listRss   : wifiInfo.listRss,
			apName    : wifiInfo.appName
		}
	});
	
	await next();
};
