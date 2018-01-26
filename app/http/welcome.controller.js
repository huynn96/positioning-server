class WelcomeController {
	
	constructor(quotes, roomRepository) {
		this.quotes         = quotes;
		this.roomRepository = roomRepository;
	}
	
	static get dependencies() {
		return ['quotes', 'RoomRepository'];
	}
	
	async index(context) {
		context.body = context.view.make('index')
			.bind('quote', this.quotes.get())
			.bind('rooms', await this.roomRepository.getRooms())
		;
	}
	
	async user(context) {
		context.body = context.view.make('welcome')
			.bind('user', context.user)
		;
	}
}

module.exports = WelcomeController;
