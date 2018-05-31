class MotionRepository {
    constructor(database, request) {
        this.database = database;
        this.request  = request;
    }
    
    async addMotionInfo(motionInfos, stepParamsA, stepParamsB) {
        let accelerations = motionInfos['accelerations'].map(acceleration => acceleration.toJson());
        let directions    = motionInfos['directions'].map(direction => direction.toJson());
        if (accelerations.length < 80) {
            throw new Error('acceleration info not enough');
        }
        let options = {
            method: 'POST',
            uri   : 'http://localhost:5000/cal-do',
            body  : {
                accelerations: accelerations,
                directions   : directions,
                stepParamsA  : stepParamsA,
                stepParamsB  : stepParamsB
            },
            json  : true
        };
        let result  = await this.request(options);
        console.log(result);
        return result;
    }
    
    async storeGaussianMotion(motionInfo) {
        let referencePointStart  = await this.database('reference_point_info').select()
            .where('room_id', motionInfo.roomId)
            .andWhere('x', motionInfo.x1)
            .andWhere('y', motionInfo.y1)
        ;
        let referencePointFinish = await this.database('reference_point_info').select()
            .where('room_id', motionInfo.roomId)
            .andWhere('x', motionInfo.x2)
            .andWhere('y', motionInfo.y2)
        ;
        
        let referencePointStartId = referencePointStart.length ? referencePointStart[0]['id'] : 1;
        if (!referencePointStart.length) {
            referencePointStart   = await this.database('reference_point_info').insert({
                room_id: motionInfo.roomId,
                x      : motionInfo.x1,
                y      : motionInfo.y1
            });
            referencePointStartId = referencePointStart[0];
        }
        let referencePointFinishId = referencePointFinish.length ? referencePointFinish[0]['id'] : 1;
        if (!referencePointFinish.length) {
            referencePointFinish   = await this.database('reference_point_info').insert({
                room_id: motionInfo.roomId,
                x      : motionInfo.x2,
                y      : motionInfo.y2
            });
            referencePointFinishId = referencePointFinish[0];
        }
        let directionRoom = await this.database('room').select('direction').where('id', motionInfo.roomId);
        directionRoom = directionRoom[0]['direction'];
        let {oExactly, dExactly} = this.calculateExactly(directionRoom, referencePointStart[0], referencePointFinish[0]);
        return await this.database('motion').insert({
            reference_point_start_id : referencePointStartId,
            reference_point_finish_id: referencePointFinishId,
            direction                : motionInfo.direction,
            offset                   : motionInfo.offset,
            exactly_direction        : dExactly,
            exactly_offset           : oExactly,
            step_count               : motionInfo.stepCount
        });
    }
    
    calculateExactly(directionRoom, referencePointStart, referencePointFinish) {
        let oExactly = Math.sqrt((referencePointStart.x - referencePointFinish.x) * (referencePointStart.x - referencePointFinish.x) + (referencePointStart.y - referencePointFinish.y) * ((referencePointStart.y - referencePointFinish.y)));
        let dExactly = Math.atan2(referencePointFinish.x - referencePointStart.x, referencePointFinish.y - referencePointStart.y) * 180 / Math.PI;
        dExactly = dExactly + parseInt(directionRoom);
        dExactly = dExactly < 0 ? dExactly + 360 : dExactly;
        dExactly = dExactly > 360 ? dExactly % 360 : dExactly;
        return {oExactly, dExactly};
    }
    
}

module.exports = MotionRepository;
