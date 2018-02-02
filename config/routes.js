module.exports = {

    index: {
        url: '/',
        method: 'get',
        handlers: ['WelcomeController.index']
    },

    user: {
        url: '/welcome/:user',
        method: 'get',
        handlers: [
            require('app/http/middlewares/format-username.middleware'),
            'WelcomeController.user'
        ]
    },
    
    getRooms: {
		url: '/api/mobile/rooms',
		method: 'get',
		handlers: [
			'FingerprinterController.getRooms'
		]
    },
	
	getBuildings: {
		url: '/api/mobile/buildings',
		method: 'get',
		handlers: [
			'FingerprinterController.getBuildings'
		]
	},
	
	addWifiInfo: {
		url: '/api/mobile/add-wifi-info',
		method: 'post',
		handlers: [
			require('app/http/middlewares/wifi.middleware'),
			'FingerprinterController.addWifiInfo'
		]
	},
	
	localization: {
		url: '/api/mobile/localization',
		method: 'post',
		handlers: [
			require('app/http/middlewares/localization.middleware'),
			'FingerprinterController.positioning'
		]
	}
};
