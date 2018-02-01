class FingerprinterController {
	
	constructor(roomRepository, wifiRepository, gaussianWifiService, localization) {
		this.roomRepository      = roomRepository;
		this.wifiRepository      = wifiRepository;
		this.gaussianWifiService = gaussianWifiService;
		this.localization        = localization;
	}
	
	static get dependencies() {
		return ['RoomRepository', 'WifiRepository', 'GaussianWifiService', 'Localization'];
	}
	
	async getRooms(context) {
		context.body = await this.roomRepository.getRooms();
	}
	
	async addWifiInfo(context) {
		let [fingerPrinterInfoId] = await this.wifiRepository.addWifiInfo(context.wifiInfoObject);
		await this.gaussianWifiService.calculateGaussian(fingerPrinterInfoId);
		context.body = {
			type   : 'success',
			message: 'Upload new wifi info successfully!'
		};
	}
	
	async positioning(context) {
		let p = await this.localization.positioning(context.wifiInfos, context.positionInfo);
		console.log(p);
	}
}

module.exports = FingerprinterController;
