
class Acceleration {
	constructor(x, y, z, createdAt) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.createdAt = createdAt;
	}

	toDBObject() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
            created_at: this.createdAt
		}
	}
	
	toJson() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            createdAt: this.createdAt
        }
	}

}

module.exports = Acceleration;
