const ENS = require('ethereum-ens');
const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const ens = new ENS(web3);
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');



const getAddrByDomain = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let domain = fields.domain;
    let appid = fields.appid;
    if (!udapValidator.isDomainName(domain))
        ctx.throw("'domainName' param error");
    await udapValidator.appidRegistered(appid);
    let address =await ens.resolver(domain).addr().then( addr => {
        return addr;
    });
    ctx.response.body = Result.success(address);
};

const getDomainByAddr = async (ctx) => {

    let fields = ctx.query;
    if (!fields) ctx.throw("no param ");

    // valid data
    let address = fields.address;
    if (!web3.isAddress(address))
        ctx.throw("'address' param error");
    await udapValidator.appidRegistered(fields.appid);

    let domain = await ens.reverse(address).name().then( domain => {
        return domain;
    });
    ctx.response.body = Result.success(domain);
};



module.exports  = {
    getAddrByDomain:getAddrByDomain,
    getDomainByAddr:getDomainByAddr
};
