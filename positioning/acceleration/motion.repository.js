class MotionRepository {
    constructor(database, request) {
        this.database = database;
        this.request = request;
    }
    
    async addMotionInfo(motionInfos) {
        let accelerations = motionInfos['accelerations'].map(acceleration => acceleration.toJson());
        let directions = motionInfos['directions'].map(direction => direction.toJson());
        if (accelerations.length < 80) {
            throw new Error('acceleration info not enough');
        }
        let options = {
            method: 'POST',
            uri: 'http://localhost:5000/cal-do',
            body: {
                accelerations: accelerations,
                directions: directions
            },
            json: true
        };
        let result = await this.request(options);
        console.log(result);
        // result.forEach(row => {
        //     if (row === 0) {
        //         console.log('Standing');
        //     } else {
        //         console.log('Walking');
        //     }
        // });
        // console.log('-----------------------------------------------------------');
        return result;
        // return this.database('accelerations').insert(rows);
    }
    
}

module.exports = MotionRepository;
