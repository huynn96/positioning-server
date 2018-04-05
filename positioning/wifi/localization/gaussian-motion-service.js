const Gauss = require('gauss');

class GaussianMotionService {
    constructor(database) {
        this.database = database;
    }
    
    async calculateGaussian(referencePointStartId, referencePointFinishId) {
        
        let rows              = await this.database('motion').select()
            .where({
                reference_point_start_id : referencePointStartId,
                reference_point_finish_id: referencePointFinishId
            });
        let gaussDirection    = Gauss.Vector(rows.map(row => row.direction));
        let meanDirection     = gaussDirection.mean();
        let varianceDirection = gaussDirection.variance();
        let gaussOffset       = Gauss.Vector(rows.map(row => row.offset));
        let meanOffset        = gaussOffset.mean();
        let varianceOffset    = gaussOffset.variance();
        let gaussianUpdate    = await this.updateGaussian(referencePointStartId, referencePointFinishId, meanDirection, varianceDirection, meanOffset, varianceOffset);
        if (!gaussianUpdate) {
            await this.database('gaussian_motion').insert({
                mean_direction           : meanDirection,
                variance_direction       : varianceDirection,
                mean_offset              : meanOffset,
                variance_offset          : varianceOffset,
                reference_point_start_id : referencePointStartId,
                reference_point_finish_id: referencePointFinishId,
            });
        }
    }
    
    updateGaussian(referencePointStartId, referencePointFinishId, meanDirection, varianceDirection, meanOffset, varianceOffset) {
        return this.database('gaussian_motion').update({
                mean_direction    : meanDirection,
                variance_direction: varianceDirection,
                mean_offset       : meanOffset,
                variance_offset   : varianceOffset
            })
            .where({
                reference_point_start_id : referencePointStartId,
                reference_point_finish_id: referencePointFinishId,
            });
    }
}

module.exports = GaussianMotionService;
