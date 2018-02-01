module.exports = async function (context, next) {
	let data = context.request.body;
	context.wifiInfoObject = {
		x: data.x,
		y: data.y,
		room_id: data.roomId,
		ap_name: data.apName,
		mac_address: data.macAddress,
		rss: data.rss
	};
	
	await next();
};
