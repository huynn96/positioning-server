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
                "buildingId"     : 2,
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
        let p = await this.localization.gaussDucPositioning(context.wifiInfos, context.positionInfo);
        console.log(p);
        let max = p.reduce(function (max, current) {
            return (max.probability < current.probability) ? max : current
        }, -1);
        console.log(max);
    }
    
    async storeMotionInfo(context) {
        console.log("request add motion infos api");
        let {referencePointStartId, referencePointFinishId} = await this.motionRepository.storeGaussianMotion(context.motionInfo);
        await this.gaussianMotionService.calculateGaussian(referencePointStartId, referencePointFinishId);
        context.body = {
            type   : 'success',
            message: 'Upload new wifi info successfully!'
        };
    }
}

module.exports = FingerprinterController;
