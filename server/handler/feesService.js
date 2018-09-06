
const Result = require('../common/result');
const Fees = require('../model/fees');

const queryFees = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let destination = fields.destination;
    let action = fields.action;
    let appid = fields.appid;
    if (!destination || !web3.isAddress(destination))
        ctx.throw("'destination' param error");
    if (!action)
        ctx.throw("'action' param error");
    await udapValidator.appidRegistered(appid);

    let feesObj = await Fees.findOne(
        { where: {destination:destination,methodId:action} }
    ).catch(err =>{
        ctx.throw(err);
    });
    let content = {fees:"0"};
    if(feesObj)
        content.fees = feesObj.fees;

    ctx.response.body = Result.success(content);
};



module.exports  = { queryFees:queryFees};

