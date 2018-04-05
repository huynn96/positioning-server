module.exports = async function (context, next) {
    let reqData = context.request.body;
    
    console.log(reqData);
    if (reqData.offset === 0) {
        context.status = 400;
        return context.body = 'Standing still';
    }
    context.motionInfo = reqData;
    await next();
};
