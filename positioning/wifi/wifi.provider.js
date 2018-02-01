const WifiRepository = require('./wifi.repository');
const GaussianWifiService = require('./localization/gaussian-wifi-service');
const Localization = require('./localization/localization');

exports.register = async (container) => {
	container.singleton('WifiRepository', async () => new WifiRepository(
		await container.make('database')
	));
	
	container.singleton('GaussianWifiService', async () => new GaussianWifiService(
		await container.make('database')
	));
	
	container.singleton('Localization', async () => new Localization(
		await container.make('database')
	));
};

exports.boot = async (container) => {

};
