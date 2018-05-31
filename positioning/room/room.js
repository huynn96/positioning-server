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
	
	toJson() {
		return {
			roomId: this.id,
			roomName: this.roomName,
			buildingId: 1
		}
	}
}

module.exports = Room;
