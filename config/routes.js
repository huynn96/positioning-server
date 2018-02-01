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
		url: '/rooms',
		method: 'get',
		handlers: [
			'FingerprinterController.getRooms'
		]
    },
	
	addWifiInfo: {
		url: '/add-wifi-info',
		method: 'post',
		handlers: [
			require('app/http/middlewares/wifi.middleware'),
			'FingerprinterController.addWifiInfo'
		]
	},
	
	localization: {
		url: '/localization',
		method: 'post',
		handlers: [
			require('app/http/middlewares/localization.middleware'),
			'FingerprinterController.positioning'
		]
	}
};
