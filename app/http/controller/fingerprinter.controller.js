const lodash = require('lodash');

class FingerprinterController {
    
    constructor(roomRepository, wifiRepository, gaussianWifiService, localization, motionRepository, gaussianMotionService) {
        this.roomRepository        = roomRepository;
        this.wifiRepository        = wifiRepository;
        this.gaussianWifiService   = gaussianWifiService;
        this.localization          = localization;
        this.motionRepository      = motionRepository;
        this.gaussianMotionService = gaussianMotionService;
    }
    
    static get dependencies() {
        return ['RoomRepository', 'WifiRepository', 'GaussianWifiService', 'Localization', 'motion.repository', 'GaussianMotionService'];
    }
    
    async getRooms(context) {
        console.log("request rooms api");
        // context.body = await this.roomRepository.getRooms();
        context.body = {
            "errorCode": 0,
            "msg"      : "success",
            "data"     : [{
                "roomId"    : 1,
                "roomName"  : "Phòng trọ",
                "buildingId": 1
            }]
        }
    }
    
    getBuildings(context) {
        console.log("request building api");
        context.body = {
            "errorCode": 0,
            "msg"      : "success",
            "data"     : [{
                "buildingId"     : 1,
                "buildingName"   : "Nhà riêng",
                "buildingAddress": "Việt Hưng"
            }]
        };
    }
    
    async addWifiInfo(context) {
        console.log("request add wifi info api");
        let referencePointId = await this.wifiRepository.addWifiInfo(context.positionInfo, context.wifiInfos);
        await this.gaussianWifiService.calculateGaussian(referencePointId);
        context.body = {
            type   : 'success',
            message: 'Upload new wifi info successfully!'
        };
    }
    
    async positioning(context) {
        console.log("request localization api");
        let gaussianWifi = await this.localization.gaussReversePositioning(context.wifiInfos, context.positionInfo);
        gaussianWifi.forEach(r1 => r1.probability = 1 - r1.probability);
        gaussianWifi = gaussianWifi.sort((r1, r2) => r2.probability - r1.probability);
        let candidates = lodash.take(gaussianWifi, 4);
        if (context.oldCandidates.length) {
            let gaussianMotion = await this.localization.gaussianMotionPositioning(candidates, context.motionInfo, context.oldCandidates);
            candidates         = lodash.take(gaussianMotion.sort((r1, r2) => r2.probability - r1.probability), 4);
            console.log(candidates);
        }
        context.body = {
            type: 'success',
            data: candidates.map((candidate) => {
                return {
                    x            : candidate.x,
                    y            : candidate.y,
                    probability  : candidate.probability,
                    transactionId: context.positionInfo.transactionId + 1
                }
            })
        };
    }
    
    async storeMotionInfo(context) {
        console.log("request add motion infos api");
        let gaussianWifi                                    = await this.localization.gaussReversePositioning(context.wifiInfos, context.positionInfo);
        let max                                             = gaussianWifi.reduce(function (max, current) {
            return (max.probability < current.probability) ? max : current
        }, -1);
        context.motionInfo.x2                               = max.x;
        context.motionInfo.y2                               = max.y;
        let {referencePointStartId, referencePointFinishId} = await this.motionRepository.storeGaussianMotion(context.motionInfo);
        await this.gaussianMotionService.calculateGaussian(referencePointStartId, referencePointFinishId, context.motionInfo.stepCount);
        context.body = {
            type: 'success',
            data: {
                x            : max.x,
                y            : max.y,
                transactionId: context.positionInfo.transactionId
            }
        };
    }
}

module.exports = FingerprinterController;
