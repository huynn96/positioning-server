class WifiRepository {
	constructor(database) {
		this.database = database;
	}
	
	async addWifiInfo(wifiInfoObject) {
		let referencePoint   = await this.database('reference_point_info').select()
			.where('room_id', wifiInfoObject.room_id)
			.andWhere('x', wifiInfoObject.x)
			.andWhere('y', wifiInfoObject.y)
		;
		
		let referencePointId = referencePoint.length ? referencePoint[0]['id'] : 1;
		if (!referencePoint.length) {
			referencePointId = await this.database('reference_point_info').insert({
				room_id: wifiInfoObject.room_id,
				x      : wifiInfoObject.x,
				y      : wifiInfoObject.y
			});
			referencePointId = referencePointId[0];
		}
		
		return await this.database('fingerprint_info').insert({
			reference_point_id: referencePointId,
			ap_name           : wifiInfoObject.ap_name,
			mac_address       : wifiInfoObject.mac_address,
			rss               : wifiInfoObject.rss
		});
	}
	
}

module.exports = WifiRepository;
