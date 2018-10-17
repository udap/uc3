const ENS = require('ethereum-ens');
const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const ens = new ENS(new Web3.providers.HttpProvider(ethereumCfg.provider));
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');



const getAddrByDN = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let domainName = fields.domainName;
    let appid = fields.appid;
    if (!udapValidator.isDomainName(domainName))
        ctx.throw("'domainName' param error");
    await udapValidator.appidRegistered(appid);
    let address =await ens.resolver(domainName).addr().then( addr => {
        return addr;
    });
    ctx.response.body = Result.success(address);
};

module.exports  = {
    getAddrByDN:getAddrByDN
};
