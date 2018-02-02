class WifiRepository {
	constructor(database) {
		this.database = database;
	}
	
	async addWifiInfo(positionInfo, wifiInfos) {
		let referencePoint   = await this.database('reference_point_info').select()
			.where('room_id', positionInfo.roomId)
			.andWhere('x', positionInfo.x)
			.andWhere('y', positionInfo.y)
		;

		let referencePointId = referencePoint.length ? referencePoint[0]['id'] : 1;
		if (!referencePoint.length) {
			referencePointId = await this.database('reference_point_info').insert({
				room_id: positionInfo.roomId,
				x      : positionInfo.x,
				y      : positionInfo.y
			});
			referencePointId = referencePointId[0];
		}
		let rows = wifiInfos.reduce((rows, wifiInfo) => {
			return rows.concat(wifiInfo.listRss.map(rss => {
				return {
					reference_point_id: referencePointId,
					mac_address: wifiInfo.macAddress,
					ap_name: wifiInfo.apName,
					rss: rss
				}
			}));
		}, []);
		await this.database('fingerprint_info').insert(rows);
		return referencePointId;
	}
	
}

module.exports = WifiRepository;
