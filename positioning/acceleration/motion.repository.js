class MotionRepository {
    constructor(database) {
        this.database = database;
    }
    
    addMotionInfo(motionInfos) {
        let rows = motionInfos.map(motionInfo => motionInfo.toDBObject());
        return this.database('accelerations').insert(rows);
    }
    
}

module.exports = MotionRepository;
