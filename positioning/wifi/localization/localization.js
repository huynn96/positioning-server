const Gaussian = require('gaussian');

class Localization {
	constructor(database) {
		this.database = database;
	}
	
	async positioning(wifiInfos, positionInfo) {
		let referencePoints = await this.database('reference_point_info').select().where('room_id', positionInfo.roomId);
		let gaussianInfos = await this.database('gaussian_fingerprint_info').select();
		return referencePoints.map(referencePoint => {
			let pWifi = wifiInfos.map(wifiInfo => {
				let gaussInfo = gaussianInfos.find(gaussianInfo => {
					return (gaussianInfo.reference_point_id === referencePoint.id) && (gaussianInfo.mac_address === wifiInfo.macAddress);
				});
				let distribution = Gaussian(gaussInfo.mean, gaussInfo.variance);
				return distribution.pdf(wifiInfo.rss);
			});
			return {
				id: referencePoint.id,
				x: referencePoint.x,
				y: referencePoint.y,
				roomId: referencePoint.room_id,
				probability: pWifi.reduce((a, b) => a * b, 1)
			}
		})
	}
}

module.exports = Localization;
