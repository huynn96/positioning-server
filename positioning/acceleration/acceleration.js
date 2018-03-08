const TYPE_ACTIVITY = require('./type-activity');

class Acceleration {
	constructor(x, y, z, label, createdAt) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.label = label;
		this.createdAt = createdAt;
	}

	toDBObject() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			label: this.label,
            created_at: this.createdAt
		}
	}
	
	toJson() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            label: this.label,
            createdAt: this.createdAt
        }
	}

}

module.exports = Acceleration;
