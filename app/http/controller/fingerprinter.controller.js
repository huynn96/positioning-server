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
        let rooms = await this.roomRepository.getRooms();
        context.body = {
            "errorCode": 0,
            "msg"      : "success",
            "data"     : rooms
        }
    }
    
    getBuildings(context) {
        console.log("request building api");
        context.body = {
            "errorCode": 0,
            "msg"      : "success",
            "data"     : [{
                "buildingId"     : 1,
                "buildingName"   : "UET",
                "buildingAddress": "Việt Hưng"
            },
                {
                    "buildingId"     : 2,
                    "buildingName"   : "Nhà",
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
        console.log(context.positionInfo.transactionId);
        let gaussianWifi = await this.localization.gaussReversePositioning(context.wifiInfos, context.positionInfo);
        gaussianWifi.forEach(r1 => r1.probability = 1 - r1.probability);
        gaussianWifi = gaussianWifi.sort((r1, r2) => r2.probability - r1.probability);
        let candidates = lodash.take(gaussianWifi, 4);
        console.log(context.oldCandidates);
        console.log(candidates);
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
        console.log(gaussianWifi);
        let max = gaussianWifi.sort((r1, r2) => r1.probability - r2.probability);
        max = max[0];
        context.motionInfo.x1                               = 1;
        context.motionInfo.y1                               = 1;
        context.motionInfo.x2                               = 2;
        context.motionInfo.y2                               = 3;
        if (!context.motionInfo.isFirst) {
            let {referencePointStartId, referencePointFinishId} = await this.motionRepository.storeGaussianMotion(context.motionInfo);
            await this.gaussianMotionService.calculateGaussian(referencePointStartId, referencePointFinishId, context.motionInfo.stepCount);
        }
        context.body = {
            type: 'success',
            data: {
                x            : max.x,
                y            : max.y,
                transactionId: context.positionInfo.transactionId + 1
            }
        };
    }
}

module.exports = FingerprinterController;
