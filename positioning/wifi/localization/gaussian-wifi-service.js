const Gauss = require('gauss');

class GaussianWifiService {
	constructor(database) {
		this.database = database;
	}
	
	async calculateGaussian(referencePointId) {
		let fingerPrintInfos = await this.database('fingerprint_info').select()
			.distinct('mac_address', 'ap_name')
			.where({
				reference_point_id: referencePointId
			});
		for (let fingerPrintInfo of fingerPrintInfos) {
			let rssArrayObj    = await this.database('fingerprint_info').select('rss')
				.where({
					reference_point_id: referencePointId,
					mac_address       : fingerPrintInfo.mac_address
				});
			let gauss          = Gauss.Vector(rssArrayObj.map(rssObj => rssObj.rss));
			let mean           = gauss.mean();
			let variance       = gauss.variance();
			let gaussianUpdate = await this.updateGaussian(referencePointId, fingerPrintInfo.mac_address, mean, variance);
			if (!gaussianUpdate) {
				await this.database('gaussian_fingerprint_info').insert({
					mean              : mean,
					variance          : variance,
					reference_point_id: referencePointId,
					mac_address       : fingerPrintInfo.mac_address,
					ap_name           : fingerPrintInfo.ap_name
				});
			}
		}
	}
	
	updateGaussian(referencePointId, macAddress, mean, variance) {
		return this.database('gaussian_fingerprint_info').update({
			mean    : mean,
			variance: variance
		})
			.where({
				reference_point_id: referencePointId,
				mac_address       : macAddress
			});
	}
}

module.exports = GaussianWifiService;
