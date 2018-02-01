class ReferencePointDetail {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	setWifiInfos(wifiInfos) {
		this.wifiInfos = wifiInfos;
		return this;
	}

	setRoom(room) {
		this.room = room;
		return this;
	}

	setId(id) {
		this.id = id;
		return this;
	}

	getId() {
		return this.id;
	}

	getRoom() {
		return this.room;
	}

	getWifiInfos() {
		return this.wifiInfos;
	}

}

module.exports = ReferencePointDetail;
