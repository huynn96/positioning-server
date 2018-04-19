const Gaussian = require('gaussian');

class Localization {
    constructor(database, motionRepos) {
        this.database    = database;
        this.motionRepos = motionRepos;
    }
    
    async gaussPositioning(wifiInfos, positionInfo) {
        let referencePoints = await this.database('reference_point_info').select().where('room_id', positionInfo.roomId);
        let gaussianInfos   = await this.database('gaussian_fingerprint_info').select()
            .where('reference_point_id', 'in', referencePoints.map(referencePoint => referencePoint.id))
        ;
        return referencePoints.map(referencePoint => {
            let pWifi = wifiInfos.map(wifiInfo => {
                let gaussInfo = gaussianInfos.find(gaussianInfo => {
                    return (gaussianInfo.reference_point_id === referencePoint.id) && (gaussianInfo.mac_address === wifiInfo.macAddress);
                });
                if (gaussInfo && gaussInfo.variance > 0) {
                    let distribution = Gaussian(gaussInfo.mean, gaussInfo.variance);
                    return distribution.pdf(wifiInfo.rss);
                }
                return 0.000001;
            });
            console.log(pWifi);
            return {
                id         : referencePoint.id,
                x          : referencePoint.x,
                y          : referencePoint.y,
                roomId     : referencePoint.room_id,
                probability: pWifi.reduce((a, b) => a * b, 1)
            }
        })
    }
    
    async gaussReversePositioning(wifiInfos, positionInfo) {
        let referencePoints = await this.database('reference_point_info').select().where('room_id', positionInfo.roomId);
        let gaussianInfos   = await this.database('gaussian_fingerprint_info').select()
            .where('reference_point_id', 'in', referencePoints.map(referencePoint => referencePoint.id))
        ;
        return referencePoints.map(referencePoint => {
            let pWifi = wifiInfos.map(wifiInfo => {
                let gaussInfo = gaussianInfos.find(gaussianInfo => {
                    return (gaussianInfo.reference_point_id === referencePoint.id) && (gaussianInfo.mac_address === wifiInfo.macAddress);
                });
                if (gaussInfo && gaussInfo.variance > 0) {
                    let distribution = Gaussian(gaussInfo.mean, gaussInfo.variance);
                    return 1 - distribution.pdf(wifiInfo.rss);
                }
                return 1;
            });
            return {
                id         : referencePoint.id,
                x          : referencePoint.x,
                y          : referencePoint.y,
                roomId     : referencePoint.room_id,
                probability: pWifi.reduce((a, b) => a * b, 1)
            }
        })
    }
    
    async gaussianMotionPositioning(candidates, motionInfo, oldCandidates) {
        let gaussianInfo          = await this.database('gaussian_motion').select()
            .where('step_count', motionInfo.stepCount);
        gaussianInfo = gaussianInfo[0];
        console.log(gaussianInfo);
        let directionRoom         = await this.database('room').select('direction').where('id', motionInfo.roomId);
        directionRoom = directionRoom[0]['direction'];
        let distributionDirection = Gaussian(gaussianInfo.mean_direction, gaussianInfo.variance_direction);
        let distributionOffset    = Gaussian(gaussianInfo.mean_offset, gaussianInfo.variance_offset);
        return candidates.map(candidate => {
            let pMotion = oldCandidates.map(oldCandidate => {
                let {oExactly, dExactly} = this.motionRepos.calculateExactly(directionRoom, oldCandidate, candidate);
                return distributionOffset.pdf(oExactly - motionInfo.offset) * distributionDirection.pdf(dExactly - motionInfo.direction) * candidate.probability * oldCandidate.probability;
            });
            let total = pMotion.reduce((count, p) => count + p, 0);
            console.log(total);
            console.log(pMotion);
            pMotion = pMotion.map(p => {
                return p / total;
            }).sort((r1, r2) => r2 - r1);
            console.log(pMotion);
            return {
                x          : candidate.x,
                y          : candidate.y,
                probability: pMotion[0]
            }
        });
    }
}

module.exports = Localization;
