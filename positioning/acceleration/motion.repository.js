class MotionRepository {
    constructor(database, request) {
        this.database = database;
        this.request = request;
    }
    
    async addMotionInfo(motionInfos, stepParamsA, stepParamsB) {
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
                directions: directions,
                stepParamsA: stepParamsA,
                stepParamsB: stepParamsB
            },
            json: true
        };
        let result = await this.request(options);
        console.log(result);
        return result;
    }
    
    async storeGaussianMotion(motionInfo) {
        console.log(motionInfo);
        let referencePointStart   = await this.database('reference_point_info').select()
            .where('room_id', motionInfo.roomId)
            .andWhere('x', motionInfo.x1)
            .andWhere('y', motionInfo.y1)
        ;
        let referencePointFinish   = await this.database('reference_point_info').select()
            .where('room_id', motionInfo.roomId)
            .andWhere('x', motionInfo.x2)
            .andWhere('y', motionInfo.y2)
        ;
        
        let referencePointStartId = referencePointStart.length ? referencePointStart[0]['id'] : 1;
        if (!referencePointStart.length) {
            referencePointStartId = await this.database('reference_point_info').insert({
                room_id: motionInfo.roomId,
                x      : motionInfo.x1,
                y      : motionInfo.y1
            });
            referencePointStartId = referencePointStartId[0];
        }
        let referencePointFinishId = referencePointFinish.length ? referencePointFinish[0]['id'] : 1;
        if (!referencePointFinish.length) {
            referencePointFinishId = await this.database('reference_point_info').insert({
                room_id: motionInfo.roomId,
                x      : motionInfo.x2,
                y      : motionInfo.y2
            });
            referencePointFinishId = referencePointFinishId[0];
        }
        await this.database('motion').insert({
            reference_point_start_id: referencePointStartId,
            reference_point_finish_id: referencePointFinishId,
            direction: motionInfo.direction,
            offset: motionInfo.offset,
            step_count: motionInfo.stepCount
        });
        return {referencePointStartId, referencePointFinishId};
    }
    
}

module.exports = MotionRepository;
