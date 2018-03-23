class Direction {
    constructor(direction, pitch, roll, createdAt) {
        this.direction = direction;
        this.pitch = pitch;
        this.roll = roll;
        this.createdAt = createdAt;
    }
    
    toDBObject() {
        return {
            direction: this.direction,
            pitch: this.pitch,
            roll: this.roll,
            created_at: this.createdAt
        }
    }
    
    toJson() {
        return {
            direction: this.direction,
            pitch: this.pitch,
            roll: this.roll,
            createdAt: this.createdAt
        }
    }
    
}

module.exports = Direction;
