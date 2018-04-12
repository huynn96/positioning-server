const Gaussian = require('gaussian');

class Localization {
    constructor(database) {
        this.database = database;
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
    
    async gaussianMotionPositioning(gaussianWifi, motionInfo, oldCandidate) {
        oldCandidate.sort((c1, c2) => c1.probability - c2.probability);
        gaussianWifi.sort((w1, w2) => w1.probability - w2.probability);
        let gaussianInfos   = await this.database('gaussian_motion').select()
            .where('reference_point_start_id', 'in', referencePoints.map(referencePoint => referencePoint.id))
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
}

module.exports = Localization;
