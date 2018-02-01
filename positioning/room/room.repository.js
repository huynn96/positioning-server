const Room = require('./room');

class RoomRepository {
	constructor(database) {
		this.database = database;
	}
	
	/**
	 *
	 * @return [Room]
	 */
	async getRooms() {
		let rooms = this.database('room').select();
		return rooms.map(room => new Room(room['room_name'], room['address']));
	}
	
	async postWifiInfo() {
	
	}
	
}

module.exports = RoomRepository;
