const ENS = require('ethereum-ens');
const ethereumCfg = require('../config/ethereumCfg');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumCfg.provider));
const ens = new ENS(web3);
const Result = require('../common/result');
const udapValidator = require('../common/udapValidator');
const ethereumUtil = require('../util/ethereumUtil');
const signUtil = require('../util/signUtil');



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
const registerSubDomain = async (ctx) => {

    let fields = ctx.request.body;
    if (!fields) ctx.throw("no param ");
    let caller = ctx.header["x-identity"];
    let domain = fields.domain;
    let sig = fields.sig;

    // valid data
    let address = fields.address;
    if (!web3.isAddress(address))
        ctx.throw("'address' param error");
    await udapValidator.appidRegistered(fields.appid);

    let txHash = await ethereumUtil.registerSubdomain(caller,domain,caller,sig);
    ctx.response.body = Result.success(txHash);
};



module.exports  = {
    getAddrByDomain:getAddrByDomain,
    getDomainByAddr:getDomainByAddr,
    registerSubDomain:registerSubDomain
};
