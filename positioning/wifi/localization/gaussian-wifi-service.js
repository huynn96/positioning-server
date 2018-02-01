const Gauss = require('gauss');

class GaussianWifiService {
	constructor(database) {
		this.database = database;
	}
	
	async calculateGaussian(fingerPrintInfoId) {
		let [fingerPrintInfo] = await this.database('fingerprint_info').select().where('id', fingerPrintInfoId);
		let rssArrayObj         = await this.database('fingerprint_info').select('rss')
			.where({
				reference_point_id: fingerPrintInfo.reference_point_id,
				mac_address       : fingerPrintInfo.mac_address
			});
		let gauss               = Gauss.Vector(rssArrayObj.map(rssObj => rssObj.rss));
		let mean                = gauss.mean();
		let variance            = gauss.variance();
		let gaussianUpdate      = await this.updateGaussian(fingerPrintInfo.reference_point_id, fingerPrintInfo.mac_address, mean, variance);
		console.log(gaussianUpdate);
		if (!gaussianUpdate) {
			return this.database('gaussian_fingerprint_info').insert({
				mean              : mean,
				variance          : variance,
				reference_point_id: fingerPrintInfo.reference_point_id,
				mac_address       : fingerPrintInfo.mac_address
			});
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
