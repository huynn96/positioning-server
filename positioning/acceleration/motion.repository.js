class MotionRepository {
    constructor(database, request) {
        this.database = database;
        this.request = request;
    }
    
    async addMotionInfo(motionInfos) {
        let rows = motionInfos.map(motionInfo => motionInfo.toJson());
        let lastTime = rows.reduce((last, row) => {
            return last > row['createdAt'] ? last : row['createdAt']
        }, 0);
        console.log(lastTime);
        console.log(rows.length);
        if (rows.length < 80) {
            throw new Error('acceleration info not enough');
        }
        let options = {
            method: 'POST',
            uri: 'http://localhost:5000/cal-do',
            body: rows,
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
        return {
            result: result,
            lastTime: lastTime
        }
        // return this.database('accelerations').insert(rows);
    }
    
}

module.exports = MotionRepository;
