class Room {
	constructor(roomName, address) {
		this.roomName = roomName;
		this.address = address;
	}

	setId(id) {
		this.id = id;
		return this;
	}

	getId() {
		return this.id;
	}
}

module.exports = Room;
