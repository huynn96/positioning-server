const Gaussian = require('gaussian');
const lodash = require('lodash');

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
        let gaussianInfos   = await Promise.all(referencePoints.map(referencePoint => {
                return this.database('gaussian_fingerprint_info').select()
                .where('reference_point_id', referencePoint.id)
                .orderBy('mean', 'desc')
                .limit(5)
            }))
        ;
        gaussianInfos = gaussianInfos.reduce((result, gaussianInfo) => [...result, ...gaussianInfo], []);
        return referencePoints.map(referencePoint => {
            let pWifi = wifiInfos.map(wifiInfo => {
                let gaussInfo = gaussianInfos.find(gaussianInfo => {
                    return (gaussianInfo.reference_point_id === referencePoint.id) && (gaussianInfo.mac_address === wifiInfo.macAddress);
                });
                if (gaussInfo && gaussInfo.variance > 0 && (wifiInfo.rss < (gaussInfo.mean + 1.96 * gaussInfo.variance)) &&  (wifiInfo.rss > (gaussInfo.mean - 1.96 * gaussInfo.variance))) {
                    let distribution = Gaussian(gaussInfo.mean, gaussInfo.variance);
                    return 1 - (distribution.cdf(wifiInfo.rss + Math.sqrt(gaussInfo.variance)) - distribution.cdf(wifiInfo.rss - Math.sqrt(gaussInfo.variance)));
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
        let gaussianInfo = await this.database('gaussian_motion').select()
            .where('step_count', motionInfo.stepCount);
        gaussianInfo     = gaussianInfo[0];
        console.log(gaussianInfo);
        console.log(motionInfo);
        let directionRoom         = await this.database('room').select('direction').where('id', motionInfo.roomId);
        directionRoom             = directionRoom[0]['direction'];
        let distributionDirection = Gaussian(gaussianInfo.mean_direction, gaussianInfo.variance_direction);
        let distributionOffset    = Gaussian(gaussianInfo.mean_offset, gaussianInfo.variance_offset);
        candidates                = candidates.map(candidate => {
            let pMotion = oldCandidates.map(oldCandidate => {
                let {oExactly, dExactly} = this.motionRepos.calculateExactly(directionRoom, oldCandidate, candidate);
                let po = distributionOffset.cdf(oExactly - motionInfo.offset + Math.sqrt(gaussianInfo.variance_offset)) - distributionOffset.cdf(oExactly - motionInfo.offset - Math.sqrt(gaussianInfo.variance_offset));
                let pd = distributionDirection.cdf(dExactly - motionInfo.direction + Math.sqrt(gaussianInfo.variance_direction)) - distributionDirection.cdf(dExactly - motionInfo.direction - Math.sqrt(gaussianInfo.variance_direction));
                console.log(`(${oldCandidate.x}, ${oldCandidate.y}) -> (${candidate.x}, ${candidate.y})\t${oExactly.toFixed(2)}\t${po.toFixed(5)}\t${dExactly.toFixed(2)}\t${pd.toFixed(5)}\t${candidate.probability.toFixed(2)}\t${oldCandidate.probability.toFixed(2)}`);
                return po * pd * candidate.probability * oldCandidate.probability;
            });
            console.log(pMotion);
            return {
                x          : candidate.x,
                y          : candidate.y,
                probability: pMotion.reduce((count, p) => count + p, 0)
            }
        });
        let total                 = candidates.reduce((count, p) => parseFloat(count) + parseFloat(p.probability), 0);
        return candidates.map(c => {
            c.probability = c.probability / total;
            return c;
        }).sort((r1, r2) => r2.probability - r1.probability);
    }
}

module.exports = Localization;
